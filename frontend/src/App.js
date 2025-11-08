
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

// Interceptor para agregar token automáticamente
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
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-white p-2 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold">CarBid</span>
          </div>

          {user && (
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-600'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('auctions')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'auctions' ? 'bg-blue-800' : 'hover:bg-blue-600'
                }`}
              >
                Subastas
              </button>
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Bell className="h-6 w-6 cursor-pointer hover:text-blue-200 transition-colors" />
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2 text-blue-600 bg-white rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setCurrentView('register')}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
                >
                  Registro
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-blue-700 border-t border-blue-600 z-50">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                <button 
                  onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-blue-600 rounded-md"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { setCurrentView('auctions'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-blue-600 rounded-md"
                >
                  Subastas
                </button>
                <div className="border-t border-blue-600 pt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 text-blue-200 hover:text-white"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-blue-600 rounded-md"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => { setCurrentView('register'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-blue-600 rounded-md"
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
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              SUBASTA DE VEHÍCULOS EN TIEMPO REAL
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Compra y vende vehículos de manera segura y transparente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentView('auctions')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Ver Subastas
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Registro
              </button>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-96 h-48 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                <Car className="h-24 w-24 text-white opacity-80" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-80 h-8 bg-black opacity-20 rounded-full blur-md"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            SUBASTAS ACTIVAS
          </h2>
          
          {activeAuctions.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {activeAuctions.slice(0, 3).map((auction, index) => (
                <div key={auction.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`h-48 ${auction.color} flex items-center justify-center relative`}>
                    <Car className="h-20 w-20 text-white" />
                    <div className="absolute top-4 left-4 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                      #{String(auction.id).padStart(3, '0')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{auction.title}</h3>
                    <p className="text-blue-600 font-bold text-2xl mb-1">
                      Oferta actual: ${auction.currentBid.toLocaleString()}
                    </p>
                    <p className="text-gray-500 mb-4">
                      Termina en: {formatTimeRemaining(auction.endTime)}
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedAuction(auction);
                        setCurrentView('auction-detail');
                      }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Car className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No hay subastas activas en este momento</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button 
              onClick={() => setCurrentView('auctions')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Ver todas las subastas
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Compañía</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Recursos</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guías de compra</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consejos de venta</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Productos</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Subastas en vivo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Valoración de vehículos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Inspección</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financiamiento</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">CarBid</h3>
              <p className="text-blue-200 mb-4">Sistema de subastas de vehículos</p>
              <p className="text-blue-200 text-sm">Compra y vende con confianza</p>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-12 pt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">CarBid</span>
            </div>
            <p className="text-blue-200">&copy; 2025 CarBid - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ handleLogin, loginForm, setLoginForm, setCurrentView }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
          <div className="bg-white p-3 rounded-full inline-block mb-4">
            <Car className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Iniciar Sesión</h2>
          <p className="text-blue-100">Accede a tu cuenta de CarBid</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Correo:</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="px-8 pb-8">
          <p className="text-center text-gray-600">
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => setCurrentView('register')}
              className="text-blue-600 hover:underline font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
          <div className="bg-white p-3 rounded-full inline-block mb-4">
            <Car className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p className="text-blue-100">Únete a la comunidad CarBid</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
            <input
              type="text"
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Apellido:</label>
            <input
              type="text"
              value={registerForm.lastname}
              onChange={(e) => setRegisterForm({...registerForm, lastname: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Correo:</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono:</label>
            <input
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
            <select
              value={registerForm.role}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, role: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="comprador">Comprador</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="flex items-start">
              <input type="checkbox" className="mr-3 mt-1 accent-blue-600" required />
              <span className="text-sm text-gray-600">
                Al registrarte aceptas los Términos y Condiciones
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
          >
            Crear Cuenta
          </button>
        </form>
        
        <div className="px-8 pb-8">
          <p className="text-center text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => setCurrentView('login')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, auctions, setCurrentView }) {
  const userAuctions = user?.role === 'vendedor' 
    ? auctions.filter(a => a.vendedor === user.name)
    : auctions.filter(a => a.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-blue-700">
          Bienvenido, {user?.name} 
          <span className="text-2xl text-gray-500 ml-3">({user?.role})</span>
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-l-4 border-blue-500">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {userAuctions.length}
            </div>
            <p className="text-gray-600 font-medium">
              {user?.role === 'vendedor' ? 'Mis Subastas' : 'Subastas Disponibles'}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-l-4 border-green-500">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {user?.role === 'vendedor' ? '2' : '3'}
            </div>
            <p className="text-gray-600 font-medium">
              {user?.role === 'vendedor' ? 'Ventas Completadas' : 'Subastas Ganadas'}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-l-4 border-purple-500">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {user?.role === 'vendedor' ? '$45,000' : '5'}
            </div>
            <p className="text-gray-600 font-medium">
              {user?.role === 'vendedor' ? 'Total Vendido' : 'Pujas Activas'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Acciones Rápidas</h3>
              
              {user?.role === 'vendedor' && (
                <button 
                  onClick={() => setCurrentView('create-auction')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg mb-4 hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-bold shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  Crear Subasta
                </button>
              )}
              
              <button 
                onClick={() => setCurrentView('auctions')}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold"
              >
                {user?.role === 'vendedor' ? 'Ver Mis Subastas' : 'Ver Subastas'}
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-bold mb-4 text-gray-800">Notificaciones</h4>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-1">
                  {user?.role === 'vendedor' 
                    ? 'Nueva puja en tu vehículo' 
                    : 'Nueva subasta disponible'}
                </p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-8 text-gray-800">
                {user?.role === 'vendedor' ? 'Mis Subastas' : 'Subastas Disponibles'}
              </h3>
              {userAuctions.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {userAuctions.slice(0, 4).map((auction) => (
                    <div key={auction.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                         onClick={() => setCurrentView('auctions')}>
                      <div className={`h-32 ${auction.color} rounded-lg mb-4 flex items-center justify-center`}>
                        <Car className="h-12 w-12 text-white" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-gray-800">{auction.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">Estado: {auction.status}</p>
                      <p className="text-blue-600 font-bold text-xl">
                        Puja actual: ${auction.currentBid.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {user?.role === 'vendedor' 
                      ? 'No has creado subastas aún' 
                      : 'No hay subastas disponibles'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuctionDetail({
  selectedAuction,
  setCurrentView,
  formatTimeRemaining,
  user,
  handleBid,
  bidAmount,
  setBidAmount
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => setCurrentView('auctions')}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-medium"
        >
          ← Volver a subastas
        </button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-6 text-gray-800">{selectedAuction?.title}</h1>
              
              <div className={`h-80 ${selectedAuction?.color} rounded-2xl mb-6 flex items-center justify-center`}>
                <Car className="h-32 w-32 text-white" />
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Especificaciones</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Marca:</span>
                      <span className="font-bold">{selectedAuction?.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Modelo:</span>
                      <span className="font-bold">{selectedAuction?.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Año:</span>
                      <span className="font-bold">{selectedAuction?.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Kilometraje:</span>
                      <span className="font-bold">45,000 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Transmisión:</span>
                      <span className="font-bold">Automática</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Combustible:</span>
                      <span className="font-bold">Gasolina</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Estado del Vehículo</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vehículo en excelente estado, único dueño. Mantenimientos al día, 
                    sin accidentes. Interior impecable, sistema de entretenimiento 
                    actualizado. Llantas nuevas, batería recién cambiada.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Información del Vendedor</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800">{selectedAuction?.vendedor}</p>
                    <p className="text-gray-600">Vendedor verificado • 4.8/5 ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-4">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ${selectedAuction?.currentBid.toLocaleString()}
              </div>
              <p className="text-gray-600 font-medium">Puja actual</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 p-4 rounded-xl mb-6 text-center">
              <p className="font-bold text-orange-700 text-lg">
                Termina en: {formatTimeRemaining(selectedAuction?.endTime)}
              </p>
            </div>

            {user ? (
              user.role === 'comprador' ? (
                <form onSubmit={handleBid}>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">
                      Tu puja (mínimo ${(selectedAuction?.currentBid + 50)?.toLocaleString()}):
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={selectedAuction?.currentBid + 50}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-lg"
                      placeholder={(selectedAuction?.currentBid + 100)?.toString()}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg mb-4 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
                  >
                    <Gavel className="h-5 w-5" />
                    Realizar Puja
                  </button>
                </form>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-center font-medium">
                    Como vendedor no puedes realizar pujas
                  </p>
                </div>
              )
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg mb-4 shadow-lg"
              >
                Iniciar Sesión para Pujar
              </button>
            )}

            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors mb-6 flex items-center justify-center gap-2 font-bold">
              <Heart className="h-5 w-5" />
              Agregar a Favoritos
            </button>

            <div className="border-t pt-6">
              <h4 className="font-bold mb-4 text-gray-800">Historial de Pujas</h4>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-bold text-gray-800">${selectedAuction?.currentBid.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Carlos M. • Hace 5 min</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-bold text-gray-800">${(selectedAuction?.currentBid - 250).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Ana L. • Hace 12 min</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-bold text-gray-800">${selectedAuction?.basePrice.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Precio base • Hace 2 días</p>
                    </div>
                  </div>
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

function AuctionsPage({ auctions, setCurrentView, setSelectedAuction, formatTimeRemaining, user }) {
  const activeAuctions = auctions.filter(a => a.status === 'active');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Todas las Subastas</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vehículos..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-80"
              />
            </div>
            {user && user.role === 'vendedor' && (
              <button 
                onClick={() => setCurrentView('create-auction')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 font-bold shadow-lg whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                Nueva Subasta
              </button>
            )}
          </div>
        </div>

        {activeAuctions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeAuctions.map(auction => (
              <div key={auction.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`h-48 ${auction.color} flex items-center justify-center`}>
                  <Car className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{auction.title}</h3>
                  <p className="text-gray-600 mb-3">Por: {auction.vendedor}</p>
                  <div className="mb-4">
                    <p className="text-blue-600 font-bold text-2xl mb-1">
                      ${auction.currentBid.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Precio base: ${auction.basePrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-6 text-orange-600 font-semibold">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeRemaining(auction.endTime)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedAuction(auction);
                      setCurrentView('auction-detail');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg transform hover:scale-105"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Car className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No hay subastas activas en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
}

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

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        title: auctionForm.title,
        brand: auctionForm.brand,
        model: auctionForm.model,
        year: parseInt(auctionForm.year),
        description: auctionForm.description,
        basePrice: parseFloat(auctionForm.basePrice),
        endDate: auctionForm.endDate
      };

      const { data } = await api.post('/auctions', payload);
      
      // Recargar todas las subastas desde el servidor
      await loadAuctions();
      
      alert('¡Subasta creada exitosamente!');
      setCurrentView('dashboard');
    } catch (error) {
      const msg = error?.response?.data?.error || 'Error al crear la subasta';
      alert(msg);
      
      // Si falla la API, crear localmente (solo para desarrollo)
      const newAuction = {
        id: auctions.length + 1,
        ...auctionForm,
        year: parseInt(auctionForm.year),
        basePrice: parseFloat(auctionForm.basePrice),
        currentBid: parseFloat(auctionForm.basePrice),
        endTime: new Date(auctionForm.endDate),
        vendedor: user.name,
        status: 'active',
        color: ['bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 4)]
      };
      
      setAuctions([...auctions, newAuction]);
      alert('¡Subasta creada localmente (modo desarrollo)!');
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-2xl mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold">Crear Subasta</h1>
          </div>
        </div>
        
        <form onSubmit={handleCreateAuction} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 border-r border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Información del Vehículo</h3>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Título de la Subasta:</label>
                <input
                  type="text"
                  value={auctionForm.title}
                  onChange={(e) => setAuctionForm({...auctionForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Ej: Toyota Camry 2020 en excelente estado"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Marca:</label>
                <select
                  value={auctionForm.brand}
                  onChange={(e) => setAuctionForm({...auctionForm, brand: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="">Seleccionar marca</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Nissan">Nissan</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Modelo:</label>
                <input
                  type="text"
                  value={auctionForm.model}
                  onChange={(e) => setAuctionForm({...auctionForm, model: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Año:</label>
                <input
                  type="number"
                  value={auctionForm.year}
                  onChange={(e) => setAuctionForm({...auctionForm, year: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  min="1990"
                  max="2025"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Descripción:</label>
                <textarea
                  value={auctionForm.description}
                  onChange={(e) => setAuctionForm({...auctionForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  rows={4}
                  placeholder="Describe el estado, características especiales, etc."
                  required
                />
              </div>
            </div>

            <div className="p-8 bg-gray-50">
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Configuración de Subasta</h3>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Precio Base ($):</label>
                <input
                  type="number"
                  value={auctionForm.basePrice}
                  onChange={(e) => setAuctionForm({...auctionForm, basePrice: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  min="1000"
                  placeholder="10000"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-2">Fecha de Cierre:</label>
                <input
                  type="datetime-local"
                  value={auctionForm.endDate}
                  onChange={(e) => setAuctionForm({...auctionForm, endDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <h4 className="text-lg font-bold mb-4 text-gray-800">Imágenes del Vehículo</h4>
              <div className="border-2 border-dashed border-blue-300 p-8 text-center bg-blue-50 rounded-xl mb-8">
                <Car className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-4 font-medium">Arrastra las imágenes aquí o</p>
                <button
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg"
                >
                  Seleccionar Archivos
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg shadow-lg transform hover:scale-105"
              >
                CREAR SUBASTA
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTE PRINCIPAL
   ========================= */

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
      
      // Convertir las fechas de string a Date objects
      const processedAuctions = auctionsData.map(auction => ({
        ...auction,
        endTime: new Date(auction.endTime || auction.endDate),
        color: auction.color || ['bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 4)]
      }));
      
      setAuctions(processedAuctions);
    } catch (error) {
      console.error('Error cargando subastas:', error);
      // Si falla la API, usar datos mock para desarrollo
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
          color: 'bg-blue-500' 
        }
      ]);
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const diff = endTime - now;
    if (diff <= 0) return 'Finalizada';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', {
        email: loginForm.email,
        password: loginForm.password
      });
      
      localStorage.setItem('carbid_token', data.token);
      setUser(data.user);
      setCurrentView('dashboard');
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      const msg = error?.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
      alert(msg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: registerForm.firstName.trim(),
        lastname: registerForm.lastname.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        role: registerForm.role,
        phone: registerForm.phone?.trim() || null
      };

      const { data } = await api.post('/auth/register', payload);

      localStorage.setItem('carbid_token', data.token);
      setUser(data.user);
      setRegisterForm({ 
        firstName: '', 
        lastname: '', 
        email: '', 
        password: '', 
        phone: '', 
        role: 'comprador' 
      });
      setCurrentView('dashboard');
    } catch (error) {
      const msg = error?.response?.data?.error || 'No se pudo registrar. Revisa los datos.';
      alert(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('carbid_token');
    setUser(null);
    setCurrentView('home');
  };

  const handleBid = async (e) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= selectedAuction.currentBid) {
      alert('La puja debe ser mayor a la oferta actual');
      return;
    }

    try {
      const { data } = await api.post(`/auctions/${selectedAuction.id}/bid`, {
        amount: parseFloat(bidAmount)
      });

      const updatedAuctions = auctions.map(auction =>
        auction.id === selectedAuction.id
          ? { ...auction, currentBid: parseFloat(bidAmount) }
          : auction
      );
      setAuctions(updatedAuctions);
      setSelectedAuction({ ...selectedAuction, currentBid: parseFloat(bidAmount) });
      setBidAmount('');
      alert('¡Puja realizada exitosamente!');
    } catch (error) {
      const msg = error?.response?.data?.error || 'Error al realizar la puja';
      alert(msg);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginPage
            handleLogin={handleLogin}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            setCurrentView={setCurrentView}
          />
        );
      case 'register':
        return (
          <RegisterPage
            handleRegister={handleRegister}
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            setCurrentView={setCurrentView}
          />
        );
      case 'dashboard':
        return <Dashboard user={user} auctions={auctions} setCurrentView={setCurrentView} />;
      case 'auctions':
        return (
          <AuctionsPage
            auctions={auctions}
            setCurrentView={setCurrentView}
            setSelectedAuction={setSelectedAuction}
            formatTimeRemaining={formatTimeRemaining}
            user={user}
          />
        );
      case 'auction-detail':
        return (
          <AuctionDetail
            selectedAuction={selectedAuction}
            setCurrentView={setCurrentView}
            formatTimeRemaining={formatTimeRemaining}
            user={user}
            handleBid={handleBid}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
          />
        );
      case 'create-auction':
        return user && user.role === 'vendedor' ? (
          <CreateAuction
            user={user}
            auctions={auctions}
            setAuctions={setAuctions}
            setCurrentView={setCurrentView}
            loadAuctions={loadAuctions}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Car className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h2>
              <p className="text-gray-600 mb-6">Solo los vendedores pueden crear subastas</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return (
          <HomePage
            setCurrentView={setCurrentView}
            auctions={auctions}
            formatTimeRemaining={formatTimeRemaining}
            setSelectedAuction={setSelectedAuction}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
      />
      {renderCurrentView()}
    </div>
  );
};

export default CarBid;