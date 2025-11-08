import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Clock, User, Car, Gavel, Heart, Plus, Search, Bell, LogOut, Menu, X } from 'lucide-react';

// Configurar axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const IMAGE_BASE_URL = 'http://localhost:5000';
// Componente para mostrar imagen de vehículo
const VehicleImage = ({ imageUrl, alt, className = "w-full h-full object-cover" }) => {
  const [imageError, setImageError] = useState(false);
  
  const fullImageUrl = imageUrl ? `${IMAGE_BASE_URL}${imageUrl}` : null;
  
  if (!fullImageUrl || imageError) {
    return <Car className={`h-16 w-16 text-white ${className}`} />;
  }
  
  return (
    <img 
      src={fullImageUrl}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carbid_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   SUBCOMPONENTES
   ========================= */

function Header({ user, currentView, setCurrentView, mobileMenuOpen, setMobileMenuOpen, handleLogout }) {
  return (
    <header className="bg-gradient-to-r from-black to-neutral-900 text-white shadow-lg relative border-b-2 border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-white p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-yellow-500">CarBid</span>
          </div>

          {user && (
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard' ? 'bg-yellow-500 text-black' : 'hover:text-yellow-400'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('auctions')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'auctions' ? 'bg-yellow-500 text-black' : 'hover:text-yellow-400'
                }`}
              >
                Subastas
              </button>
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Bell className="h-6 w-6 cursor-pointer hover:text-yellow-400 transition-colors text-white" />
                <div className="flex items-center space-x-2">
                  <div className="bg-black border border-yellow-500 p-2 rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-yellow-400 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2 text-black bg-yellow-500 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setCurrentView('register')}
                  className="px-4 py-2 bg-black text-yellow-400 border-2 border-yellow-500 rounded-lg font-medium hover:bg-neutral-900 transition-colors"
                >
                  Registro
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-black border-t border-yellow-500 z-50">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                <button 
                  onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-yellow-400 rounded-md"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { setCurrentView('auctions'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-yellow-400 rounded-md"
                >
                  Subastas
                </button>
                <div className="border-t border-yellow-500 pt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="bg-yellow-500 p-2 rounded-full">
                      <User className="h-4 w-4 text-black" />
                    </div>
                    <span className="text-white">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 text-yellow-400 hover:text-white"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-yellow-400 rounded-md"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => { setCurrentView('register'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-yellow-400 rounded-md"
                >
                  Registro
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function HomePage({ setCurrentView, auctions, formatTimeRemaining, setSelectedAuction }) {
  const activeAuctions = auctions.filter(a => a.status === 'active');
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              SUBASTA DE VEHÍCULOS EN TIEMPO REAL
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-yellow-200 max-w-3xl mx-auto">
              Compra y vende vehículos de manera segura y transparente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentView('auctions')}
                className="bg-white text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Ver Subastas
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-black transition-colors"
              >
                Registro
              </button>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-96 h-48 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                <Car className="h-24 w-24 text-white opacity-90" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-80 h-8 bg-black opacity-30 rounded-full blur-md"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-neutral-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-yellow-400">
            SUBASTAS ACTIVAS
          </h2>
          
          {activeAuctions.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {activeAuctions.slice(0, 3).map((auction, index) => (
                <div key={auction.id} className="bg-neutral-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-500">
                  <div className={`h-48 ${auction.color?.replace(/blue/g,'neutral') || 'bg-neutral-800'} flex items-center justify-center relative`}>
                    <Car className="h-20 w-20 text-white" />
                    <div className="absolute top-4 left-4 bg-black text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                      #{String(auction.id).padStart(3, '0')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{auction.title}</h3>
                    <p className="text-yellow-400 font-bold text-2xl mb-1">
                      Oferta actual: ${auction.currentBid.toLocaleString()}
                    </p>
                    <p className="text-gray-400 mb-4">
                      Termina en: {formatTimeRemaining(auction.endTime)}
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedAuction(auction);
                        setCurrentView('auction-detail');
                      }}
                      className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-neutral-800 transition-colors border-2 border-yellow-500"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Car className="h-24 w-24 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No hay subastas activas en este momento</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button 
              onClick={() => setCurrentView('auctions')}
              className="bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-neutral-800 transition-colors shadow-lg border-2 border-yellow-500"
            >
              Ver todas las subastas
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-neutral-900 text-white py-16 border-t border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Compañía</h3>
              <ul className="space-y-2 text-yellow-200">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Recursos</h3>
              <ul className="space-y-2 text-yellow-200">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guías de compra</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consejos de venta</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Productos</h3>
              <ul className="space-y-2 text-yellow-200">
                <li><a href="#" className="hover:text-white transition-colors">Subastas en vivo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Valoración de vehículos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Inspección</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financiamiento</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">CarBid</h3>
              <p className="text-yellow-200 mb-4">Sistema de subastas de vehículos</p>
              <p className="text-yellow-200 text-sm">Compra y vende con confianza</p>
            </div>
          </div>
          
          <div className="border-t border-yellow-500 mt-12 pt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-black p-2 rounded-lg border border-yellow-500">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">CarBid</span>
            </div>
            <p className="text-yellow-200">&copy; 2025 CarBid - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ handleLogin, loginForm, setLoginForm, setCurrentView }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 flex items-center justify-center px-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-yellow-500">
        <div className="bg-gradient-to-r from-black to-neutral-900 p-8 text-center border-b border-yellow-500">
          <div className="bg-white p-3 rounded-full inline-block mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Iniciar Sesión</h2>
          <p className="text-yellow-200">Accede a tu cuenta de CarBid</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8">
          <div className="mb-6">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Correo:</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Contraseña:</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-black to-neutral-900 text-white py-3 rounded-lg font-bold hover:from-neutral-900 hover:to-neutral-700 transition-all transform hover:scale-105 shadow-lg border-2 border-yellow-500"
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="px-8 pb-8">
          <p className="text-center text-gray-400">
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => setCurrentView('register')}
              className="text-yellow-400 hover:underline font-semibold"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ handleRegister, registerForm, setRegisterForm, setCurrentView }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 flex items-center justify-center px-4 py-8">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-yellow-500">
        <div className="bg-gradient-to-r from-black to-neutral-900 p-8 text-center border-b border-yellow-500">
          <div className="bg-white p-3 rounded-full inline-block mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p className="text-yellow-200">Únete a la comunidad CarBid</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-8">
          <div className="mb-4">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Nombre:</label>
            <input
              type="text"
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Apellido:</label>
            <input
              type="text"
              value={registerForm.lastname}
              onChange={(e) => setRegisterForm({...registerForm, lastname: e.target.value})}
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Correo:</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Contraseña:</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Teléfono:</label>
            <input
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-yellow-200 text-sm font-bold mb-2">Rol:</label>
            <select
              value={registerForm.role}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, role: e.target.value })
              }
              className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
            >
              <option value="comprador" className="bg-neutral-900 text-white">Comprador</option>
              <option value="vendedor" className="bg-neutral-900 text-white">Vendedor</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="flex items-start">
              <input type="checkbox" className="mr-3 mt-1 accent-yellow-500" required />
              <span className="text-sm text-yellow-200">
                Al registrarte aceptas los Términos y Condiciones
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-black to-neutral-900 text-white py-3 rounded-lg font-bold hover:from-neutral-900 hover:to-neutral-700 transition-all transform hover:scale-105 shadow-lg border-2 border-yellow-500"
          >
            Crear Cuenta
          </button>
        </form>
        
        <div className="px-8 pb-8">
          <p className="text-center text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => setCurrentView('login')}
              className="text-yellow-400 hover:underline font-semibold"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, auctions, setCurrentView, setSelectedAuction }) {
  const userAuctions = user?.role === 'vendedor' 
    ? auctions.filter(a => a.vendedor_id === user.id)
    : auctions.filter(a => a.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400">
          Bienvenido, {user?.name} 
          <span className="text-2xl text-gray-400 ml-3">({user?.role})</span>
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 text-center border-l-4 border-yellow-500">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {userAuctions.length}
            </div>
            <p className="text-gray-400 font-medium">
              {user?.role === 'vendedor' ? 'Mis Subastas' : 'Subastas Disponibles'}
            </p>
          </div>
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 text-center border-l-4 border-green-500">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {user?.role === 'vendedor' ? '0' : '0'}
            </div>
            <p className="text-gray-400 font-medium">
              {user?.role === 'vendedor' ? 'Ventas Completadas' : 'Subastas Ganadas'}
            </p>
          </div>
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 text-center border-l-4 border-purple-500">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {user?.role === 'vendedor' ? '$0' : '0'}
            </div>
            <p className="text-gray-400 font-medium">
              {user?.role === 'vendedor' ? 'Total Vendido' : 'Pujas Activas'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 mb-8 border border-yellow-500">
              <h3 className="text-xl font-bold mb-6 text-white">Acciones Rápidas</h3>
              
              {user?.role === 'vendedor' && (
                <button 
                  onClick={() => setCurrentView('create-auction')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-4 rounded-lg mb-4 hover:from-yellow-400 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 font-bold shadow-lg"
                >
                  <Plus className="h-5 w-5 text-white" />
                  Crear Subasta
                </button>
              )}
              
              <button 
                onClick={() => setCurrentView('auctions')}
                className="w-full bg-black text-white py-4 rounded-lg hover:bg-neutral-800 transition-colors font-bold border-2 border-yellow-500"
              >
                {user?.role === 'vendedor' ? 'Ver Mis Subastas' : 'Ver Subastas'}
              </button>
            </div>
            
            <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 border border-yellow-500">
              <h4 className="text-lg font-bold mb-4 text-white">Notificaciones</h4>
              <div className="bg-black border-l-4 border-yellow-500 p-4 rounded-lg">
                <p className="text-sm text-gray-300 font-medium mb-1">
                  {user?.role === 'vendedor' 
                    ? userAuctions.length > 0 ? 'Tienes subastas activas' : 'Crea tu primera subasta' 
                    : 'Nuevas subastas disponibles'}
                </p>
                <p className="text-xs text-gray-500">Actualizado ahora</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 border border-yellow-500">
              <h3 className="text-2xl font-bold mb-8 text-white">
                {user?.role === 'vendedor' ? 'Mis Subastas' : 'Subastas Disponibles'}
              </h3>
              {userAuctions.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {userAuctions.slice(0, 4).map((auction) => (
                    <div 
                      key={auction.id} 
                      className="border border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedAuction(auction);
                        setCurrentView('auction-detail');
                      }}
                    >
                      <div className={`h-32 ${auction.color || 'bg-neutral-800'} rounded-lg mb-4 flex items-center justify-center`}>
                        <Car className="h-12 w-12 text-white" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-white">{auction.title}</h4>
                      <p className="text-sm text-gray-400 mb-1">
                        {auction.brand} {auction.model} {auction.year}
                      </p>
                      <p className="text-sm text-gray-400 mb-2">
                        Estado: <span className="font-semibold text-green-400">{auction.status}</span>
                      </p>
                      <p className="text-yellow-400 font-bold text-xl">
                        Puja actual: ${(auction.currentBid || auction.basePrice)?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {user?.role === 'vendedor' 
                      ? 'No has creado subastas aún' 
                      : 'No hay subastas disponibles'}
                  </p>
                  {user?.role === 'vendedor' && (
                    <button 
                      onClick={() => setCurrentView('create-auction')}
                      className="mt-4 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-neutral-800 transition-colors border-2 border-yellow-500"
                    >
                      Crear Mi Primera Subasta
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   AuctionDetail, AuctionsPage, CreateAuction, CarBid (componente principal)
   y funciones auxiliares siguen aquí — adaptados al tema negro/dorado.
   Continuo con AuctionDetail, AuctionsPage, CreateAuction y el componente principal.
*/

function AuctionDetail({
  selectedAuction,
  setCurrentView,
  formatTimeRemaining,
  user,
  handleBid,
  bidAmount,
  setBidAmount
}) {
  if (!selectedAuction) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Car className="h-24 w-24 text-gray-500 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Subasta no encontrada</p>
          <button 
            onClick={() => setCurrentView('auctions')}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-neutral-800 border-2 border-yellow-500"
          >
            Ver todas las subastas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => setCurrentView('auctions')}
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center gap-2 font-medium"
        >
          ← Volver a subastas
        </button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 border border-yellow-500">
              <h1 className="text-3xl font-bold mb-6 text-white">{selectedAuction.title}</h1>
              
              {/* Imagen principal */}
              <div className="h-80 rounded-2xl mb-6 flex items-center justify-center overflow-hidden bg-neutral-800">
                {selectedAuction.imageUrl ? (
                  <img 
                    src={`http://localhost:5000${selectedAuction.imageUrl}`} 
                    alt={selectedAuction.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="flex items-center justify-center w-full h-full" 
                  style={{ display: selectedAuction.imageUrl ? 'none' : 'flex' }}
                >
                  <Car className="h-32 w-32 text-white" />
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-neutral-700 transition-colors border border-gray-700">
                    <Car className="h-8 w-8 text-gray-500" />
                  </div>
                ))}
              </div>

              {/* Especificaciones */}
              <div className="mb-8">
                <div className="bg-black rounded-xl p-6 border border-yellow-500">
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">Especificaciones</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-400">Marca:</span>
                      <span className="font-bold text-white">{selectedAuction.brand}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-400">Modelo:</span>
                      <span className="font-bold text-white">{selectedAuction.model}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-400">Año:</span>
                      <span className="font-bold text-white">{selectedAuction.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-400">Precio Base:</span>
                      <span className="font-bold text-yellow-400">${selectedAuction.basePrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {selectedAuction.description && (
                <div className="bg-black rounded-xl p-6 mb-8 border border-yellow-500">
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">Descripción</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedAuction.description}
                  </p>
                </div>
              )}

              {/* Información del vendedor */}
              <div className="bg-black rounded-xl p-6 border border-yellow-500">
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Información del Vendedor</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">{selectedAuction.vendedor}</p>
                    <p className="text-gray-400">Vendedor verificado • 4.8/5 ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de pujas */}
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 h-fit sticky top-4 border border-yellow-500">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                ${selectedAuction.currentBid?.toLocaleString()}
              </div>
              <p className="text-gray-400 font-medium">Puja actual</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-500 p-4 rounded-xl mb-6 text-center">
              <p className="font-bold text-yellow-200 text-lg">
                Termina en: {formatTimeRemaining(selectedAuction.endTime)}
              </p>
            </div>

            {user ? (
              user.role === 'comprador' ? (
                <form onSubmit={handleBid}>
                  <div className="mb-6">
                    <label className="block text-gray-300 font-bold mb-2">
                      Tu puja (mínimo ${((selectedAuction.currentBid || selectedAuction.basePrice) + 50)?.toLocaleString()}):
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={(selectedAuction.currentBid || selectedAuction.basePrice) + 50}
                      className="w-full px-4 py-3 border-2 border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-lg bg-black text-white"
                      placeholder={((selectedAuction.currentBid || selectedAuction.basePrice) + 100)?.toString()}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-4 rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all font-bold text-lg mb-4 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
                  >
                    <Gavel className="h-5 w-5" />
                    Realizar Puja
                  </button>
                </form>
              ) : (
                <div className="bg-yellow-900 border border-yellow-500 rounded-lg p-4 mb-4">
                  <p className="text-yellow-200 text-center font-medium">
                    Como vendedor no puedes realizar pujas
                  </p>
                </div>
              )
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-4 rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all font-bold text-lg mb-4 shadow-lg"
              >
                Iniciar Sesión para Pujar
              </button>
            )}

            <button className="w-full border-2 border-yellow-500 text-yellow-400 py-3 rounded-lg hover:bg-neutral-800 transition-colors mb-6 flex items-center justify-center gap-2 font-bold">
              <Heart className="h-5 w-5" />
              Agregar a Favoritos
            </button>

            {/* Historial de pujas */}
            <div className="border-t border-gray-700 pt-6">
              <h4 className="font-bold mb-4 text-white">Historial de Pujas</h4>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {selectedAuction.currentBid > selectedAuction.basePrice ? (
                    <div className="flex justify-between items-center p-3 bg-black rounded-lg border border-gray-700">
                      <div>
                        <p className="font-bold text-yellow-400">${selectedAuction.currentBid?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Puja más alta • Reciente</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-black rounded-lg border border-gray-700">
                      <div>
                        <p className="font-bold text-yellow-400">${selectedAuction.basePrice?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Precio base</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              Al pujar aceptas los términos y condiciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// AuctionsPage
function AuctionsPage({ auctions, setCurrentView, setSelectedAuction, formatTimeRemaining, user }) {
  const activeAuctions = auctions.filter(a => a.status === 'active');
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-white">Todas las Subastas</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vehículos..."
                className="pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all w-full sm:w-80 bg-black text-white"
              />
            </div>
            {user && user.role === 'vendedor' && (
              <button 
                onClick={() => setCurrentView('create-auction')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all flex items-center gap-2 font-bold shadow-lg whitespace-nowrap border-2 border-yellow-500"
              >
                <Plus className="h-5 w-5 text-white" />
                Nueva Subasta
              </button>
            )}
          </div>
        </div>

        {activeAuctions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeAuctions.map(auction => (
  <div key={auction.id} className="bg-neutral-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-500">
    <div className={`h-48 ${auction.color || 'bg-neutral-800'} flex items-center justify-center overflow-hidden relative`}>
      {auction.imageUrl ? (
        <img 
          src={`http://localhost:5000${auction.imageUrl}`}
          alt={auction.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <Car 
        className="h-16 w-16 text-white" 
        style={{ display: auction.imageUrl ? 'none' : 'block' }} 
      />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-white">{auction.title}</h3>
            <p className="text-gray-400 mb-3">Por: {auction.vendedor}</p>
            <div className="mb-4">
              <p className="text-yellow-400 font-bold text-2xl mb-1">
                ${auction.currentBid.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">
                Precio base: ${auction.basePrice.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 mb-6 text-yellow-400 font-semibold">
              <Clock className="h-4 w-4 text-white" />
              <span>{formatTimeRemaining(auction.endTime)}</span>
            </div>
            <button 
              onClick={() => {
                setSelectedAuction(auction);
                setCurrentView('auction-detail');
              }}
              className="w-full bg-gradient-to-r from-black to-neutral-900 text-white py-3 rounded-lg hover:from-neutral-900 hover:to-neutral-700 transition-all font-bold shadow-lg transform hover:scale-105 border-2 border-yellow-500"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Car className="h-24 w-24 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No hay subastas activas en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
}

// CreateAuction
function CreateAuction({ user, auctions, setAuctions, setCurrentView, loadAuctions }) {
  const [auctionForm, setAuctionForm] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    description: '',
    basePrice: '',
    endDate: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manejar selección de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar número de imágenes
    if (files.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      return;
    }

    // Validar tipo y tamaño de archivos
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isImage) {
        alert(`${file.name} no es una imagen válida`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} es muy grande (máximo 5MB)`);
        return false;
      }
      return true;
    });

    setImages(validFiles);

    // Crear previsualizaciones
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Eliminar imagen
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Liberar URL del objeto
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validar fecha
      const endDate = new Date(auctionForm.endDate);
      const now = new Date();
      
      if (endDate <= now) {
        setError('La fecha de cierre debe ser futura');
        setLoading(false);
        return;
      }

      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('title', auctionForm.title.trim());
      formData.append('brand', auctionForm.brand.trim());
      formData.append('model', auctionForm.model.trim());
      formData.append('year', auctionForm.year);
      formData.append('description', auctionForm.description.trim());
      formData.append('basePrice', auctionForm.basePrice);
      formData.append('endDate', auctionForm.endDate);

      // Agregar imágenes
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      console.log('Enviando subasta con imágenes...');

      // Configurar axios para enviar FormData
      const { data } = await api.post('/auctions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Respuesta del servidor:', data);
      
      // Limpiar previsualizaciones
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      
      // Recargar todas las subastas desde el servidor
      await loadAuctions();
      
      alert('¡Subasta creada exitosamente!');
      
      // Limpiar formulario
      setAuctionForm({
        title: '',
        brand: '',
        model: '',
        year: '',
        description: '',
        basePrice: '',
        endDate: ''
      });
      setImages([]);
      setImagePreviews([]);
      
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Response data:', error?.response?.data);
      
      let errorMessage = 'Error al crear la subasta';
      
      if (error?.response?.data?.details) {
        const details = error.response.data.details;
        if (Array.isArray(details)) {
          errorMessage = details.map(d => `${d.field}: ${d.message}`).join('\n');
        } else {
          errorMessage = details;
        }
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    }
    
    setLoading(false);
  };

  // Obtener fecha mínima (ahora + 1 hora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-black to-neutral-900 text-white p-8 rounded-2xl mb-8 border border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <Car className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-yellow-400">Crear Subasta</h1>
              <p className="text-gray-300 mt-2">Publica tu vehículo para subasta</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200 whitespace-pre-line">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleCreateAuction} className="bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-yellow-500">
          <div className="grid lg:grid-cols-2">
            {/* Columna izquierda */}
            <div className="p-8 border-r border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Información del Vehículo</h3>
              
              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">
                  Título de la Subasta: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={auctionForm.title}
                  onChange={(e) => setAuctionForm({...auctionForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  placeholder="Ej: Toyota Camry 2020 en excelente estado"
                  required
                  minLength={5}
                  maxLength={255}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">
                  Marca: <span className="text-red-500">*</span>
                </label>
                <select
                  value={auctionForm.brand}
                  onChange={(e) => setAuctionForm({...auctionForm, brand: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  required
                >
                  <option value="">Seleccionar marca</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">
                  Modelo: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={auctionForm.model}
                  onChange={(e) => setAuctionForm({...auctionForm, model: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  placeholder="Ej: Corolla"
                  required
                  maxLength={100}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">
                  Año: <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={auctionForm.year}
                  onChange={(e) => setAuctionForm({...auctionForm, year: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">
                  Descripción: <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={auctionForm.description}
                  onChange={(e) => setAuctionForm({...auctionForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  rows={4}
                  placeholder="Describe el estado, características especiales, mantenimientos, etc."
                  required
                  maxLength={2000}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {auctionForm.description.length}/2000 caracteres
                </p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="p-8 bg-black">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Configuración de Subasta</h3>
              
              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">
                  Precio Base ($): <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={auctionForm.basePrice}
                  onChange={(e) => setAuctionForm({...auctionForm, basePrice: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  min="100"
                  step="50"
                  placeholder="10000"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Precio mínimo: $100
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">
                  Fecha de Cierre: <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={auctionForm.endDate}
                  onChange={(e) => setAuctionForm({...auctionForm, endDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  min={getMinDateTime()}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  La subasta debe durar al menos 1 hora
                </p>
              </div>

              {/* Sección de imágenes */}
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-4 text-gray-200">
                  Imágenes del Vehículo (Máx. 5)
                </h4>
                
                {/* Input oculto */}
                <input
                  type="file"
                  id="imageInput"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Zona de carga */}
                <label
                  htmlFor="imageInput"
                  className="border-2 border-dashed border-yellow-500 p-6 text-center bg-neutral-900 rounded-xl cursor-pointer hover:bg-neutral-800 transition-colors block"
                >
                  <Car className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                  <p className="text-gray-300 mb-2 font-medium">
                    Haz clic para seleccionar imágenes
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF, WEBP (máx. 5MB cada una)
                  </p>
                </label>

                {/* Previsualizaciones */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="bg-neutral-900 border border-yellow-500 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-white mb-2">Resumen</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vehículo:</span>
                    <span className="font-medium text-white">
                      {auctionForm.brand && auctionForm.model 
                        ? `${auctionForm.brand} ${auctionForm.model}` 
                        : 'No especificado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Año:</span>
                    <span className="font-medium text-white">{auctionForm.year || 'No especificado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Precio base:</span>
                    <span className="font-medium text-yellow-400">
                      {auctionForm.basePrice ? `$${parseFloat(auctionForm.basePrice).toLocaleString()}` : '$0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Imágenes:</span>
                    <span className="font-medium text-white">{images.length}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-black to-neutral-900 text-white hover:from-neutral-900 hover:to-neutral-700 hover:scale-105 border-2 border-yellow-500'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    CREANDO SUBASTA...
                  </span>
                ) : (
                  'CREAR SUBASTA'
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                disabled={loading}
                className="w-full mt-4 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-bold hover:bg-neutral-900 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal CarBid
const CarBid = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    firstName: '', 
    lastname: '', 
    email: '', 
    password: '', 
    phone: '', 
    role: 'comprador' 
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('carbid_token');
    if (token) {
      loadUserData();
    }
    loadAuctions();
  }, []);

  const loadUserData = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error('Error cargando usuario:', error);
      localStorage.removeItem('carbid_token');
    }
  };

  const loadAuctions = async () => {
    try {
      const { data } = await api.get('/auctions');
      const auctionsData = data.auctions || [];
      
      const processedAuctions = auctionsData.map(auction => ({
        ...auction,
        endTime: new Date(auction.endTime || auction.endDate),
        color: auction.color || ['bg-neutral-800', 'bg-green-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 4)]
      }));
      
      setAuctions(processedAuctions);
    } catch (error) {
      console.error('Error cargando subastas:', error);
      setAuctions([
        { 
          id: 1, 
          title: 'Toyota Camry 2020', 
          brand: 'Toyota', 
          model: 'Camry', 
          year: 2020, 
          basePrice: 15000, 
          currentBid: 17500, 
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), 
          vendedor: 'María González', 
          status: 'active', 
          color: 'bg-green-400' 
        },
        { 
          id: 2, 
          title: 'Honda Civic 2019', 
          brand: 'Honda', 
          model: 'Civic', 
          year: 2019, 
          basePrice: 12000, 
          currentBid: 13750, 
          endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), 
          vendedor: 'Carlos Mendoza', 
          status: 'active', 
          color: 'bg-red-400' 
        },
        { 
          id: 3, 
          title: 'Ford Mustang 2018', 
          brand: 'Ford', 
          model: 'Mustang', 
          year: 2018, 
          basePrice: 20000, 
          currentBid: 22500, 
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), 
          vendedor: 'Ana López', 
          status: 'active', 
          color: 'bg-neutral-800' 
        }
      ]);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', loginForm);
      localStorage.setItem('carbid_token', data.token);
      setUser(data.user);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error de login:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', registerForm);
      localStorage.setItem('carbid_token', data.token);
      setUser(data.user);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error de registro:', error);
      alert('No se pudo registrar el usuario.');
    }
  };

  const handleBid = async (e) => {
  e.preventDefault();
  
  if (!selectedAuction) {
    alert('No hay subasta seleccionada');
    return;
  }

  const minBid = (selectedAuction.currentBid || selectedAuction.basePrice) + 50;
  const bid = parseFloat(bidAmount);

  if (!bidAmount || isNaN(bid)) {
    alert('Ingresa un monto válido');
    return;
  }

  if (bid < minBid) {
    alert(`La puja debe ser al menos $${minBid.toLocaleString()}`);
    return;
  }

  try {
    console.log('Enviando puja:', {
      auction_id: selectedAuction.id,
      amount: bid
    });

    const { data } = await api.post('/bids', {
      auction_id: selectedAuction.id,
      amount: bid
    });

    console.log('✓ Puja exitosa:', data);

    // Actualizar las subastas localmente
    const updatedAuctions = auctions.map(auction =>
      auction.id === selectedAuction.id
        ? { ...auction, currentBid: bid }
        : auction
    );
    setAuctions(updatedAuctions);
    
    // Actualizar la subasta seleccionada
    setSelectedAuction({ 
      ...selectedAuction, 
      currentBid: bid,
      lastBidder: user.name
    });
    
    setBidAmount('');
    alert('¡Puja realizada exitosamente!');
    
  } catch (error) {
    console.error('✗ Error al realizar puja:', error);
    console.error('Response:', error?.response?.data);
    
    const msg = error?.response?.data?.error || 'Error al realizar la puja. Intenta nuevamente.';
    alert(msg);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('carbid_token');
    setUser(null);
    setCurrentView('home');
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Finalizada';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Header
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
      />

      {currentView === 'home' && (
        <HomePage
          setCurrentView={setCurrentView}
          auctions={auctions}
          formatTimeRemaining={formatTimeRemaining}
          setSelectedAuction={setSelectedAuction}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          handleLogin={handleLogin}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          handleRegister={handleRegister}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'dashboard' && user && (
        <Dashboard
          user={user}
          auctions={auctions}
          setCurrentView={setCurrentView}
          setSelectedAuction={setSelectedAuction}
        />
      )}

      {currentView === 'auction-detail' && selectedAuction && (
        <AuctionDetail
          selectedAuction={selectedAuction}
          setCurrentView={setCurrentView}
          formatTimeRemaining={formatTimeRemaining}
          user={user}
          handleBid={handleBid}
          bidAmount={bidAmount}
          setBidAmount={setBidAmount}
        />
      )}

      {currentView === 'auctions' && (
        <AuctionsPage
          auctions={auctions}
          setCurrentView={setCurrentView}
          setSelectedAuction={setSelectedAuction}
          formatTimeRemaining={formatTimeRemaining}
          user={user}
        />
      )}

      {currentView === 'create-auction' && user?.role === 'vendedor' && (
        <CreateAuction
          user={user}
          auctions={auctions}
          setAuctions={setAuctions}
          setCurrentView={setCurrentView}
          loadAuctions={loadAuctions}
        />
      )}
    </div>
  );
};

export default CarBid;
