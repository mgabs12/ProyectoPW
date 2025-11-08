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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
              
              <div className={`h-80 ${selectedAuction.color || 'bg-neutral-800'} rounded-2xl mb-6 flex items-center justify-center`}>
                <Car className="h-32 w-32 text-white" />
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <div className="bg-black rounded-xl p-6 border border-yellow-500">
                  <h3 className="text-xl font-bold mb-4 text-white">Especificaciones</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-300">Marca:</span>
                      <span className="font-bold text-white">{selectedAuction.brand}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-300">Modelo:</span>
                      <span className="font-bold text-white">{selectedAuction.model}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-300">Año:</span>
                      <span className="font-bold text-white">{selectedAuction.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-3">
                      <span className="font-medium text-gray-300">Precio Base:</span>
                      <span className="font-bold text-white">${selectedAuction.basePrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAuction.description && (
                <div className="bg-black rounded-xl p-6 mb-8 border border-yellow-500">
                  <h3 className="text-xl font-bold mb-4 text-white">Descripción</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedAuction.description}
                  </p>
                </div>
              )}

              <div className="bg-neutral-900 rounded-xl p-6 border border-yellow-500">
                <h3 className="text-xl font-bold mb-4 text-white">Información del Vendedor</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border border-yellow-500">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">{selectedAuction.vendedor}</p>
                    <p className="text-gray-400">Vendedor verificado • 4.8/5 ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 h-fit sticky top-4 border border-yellow-500">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                ${selectedAuction.currentBid?.toLocaleString()}
              </div>
              <p className="text-gray-300 font-medium">Puja actual</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-center">
              <p className="font-bold text-yellow-700 text-lg">
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
                      className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 transition-all text-lg bg-black text-white"
                      placeholder={((selectedAuction.currentBid || selectedAuction.basePrice) + 100)?.toString()}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-black to-neutral-900 text-white py-4 rounded-lg hover:from-neutral-900 hover:to-neutral-700 transition-all font-bold text-lg mb-4 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 border-2 border-yellow-500"
                  >
                    <Gavel className="h-5 w-5 text-white" />
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
                className="w-full bg-gradient-to-r from-black to-neutral-900 text-white py-4 rounded-lg hover:from-neutral-900 hover:to-neutral-700 transition-all font-bold text-lg mb-4 shadow-lg border-2 border-yellow-500"
              >
                Iniciar Sesión para Pujar
              </button>
            )}

            <button className="w-full border-2 border-yellow-500 text-white py-3 rounded-lg hover:bg-black transition-colors mb-6 flex items-center justify-center gap-2 font-bold">
              <Heart className="h-5 w-5 text-white" />
              Agregar a Favoritos
            </button>

            <div className="border-t pt-6">
              <h4 className="font-bold mb-4 text-white">Historial de Pujas</h4>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {selectedAuction.currentBid > selectedAuction.basePrice ? (
                    <div className="flex justify-between items-center p-3 bg-black rounded-lg border border-gray-700">
                      <div>
                        <p className="font-bold text-white">${selectedAuction.currentBid?.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">Puja más alta • Reciente</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-black rounded-lg border border-gray-700">
                      <div>
                        <p className="font-bold text-white">${selectedAuction.basePrice?.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">Precio base</p>
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
                <div className={`h-48 ${auction.color || 'bg-neutral-800'} flex items-center justify-center`}>
                  <Car className="h-16 w-16 text-white" />
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
        color: ['bg-neutral-800', 'bg-green-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 4)]
      };
      
      setAuctions([...auctions, newAuction]);
      alert('¡Subasta creada localmente (modo desarrollo)!');
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-black to-neutral-900 text-white p-8 rounded-2xl mb-8 border border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-yellow-400">Crear Subasta</h1>
          </div>
        </div>
        
        <form onSubmit={handleCreateAuction} className="bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-yellow-500">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 border-r border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Información del Vehículo</h3>
              
              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">Título de la Subasta:</label>
                <input
                  type="text"
                  value={auctionForm.title}
                  onChange={(e) => setAuctionForm({...auctionForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  placeholder="Ej: Toyota Camry 2020 en excelente estado"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">Marca:</label>
                <input
                  type="text"
                  value={auctionForm.brand}
                  onChange={(e) => setAuctionForm({...auctionForm, brand: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">Modelo:</label>
                <input
                  type="text"
                  value={auctionForm.model}
                  onChange={(e) => setAuctionForm({...auctionForm, model: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">Año:</label>
                <input
                  type="number"
                  value={auctionForm.year}
                  onChange={(e) => setAuctionForm({...auctionForm, year: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  min="1990"
                  max="2025"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">Descripción:</label>
                <textarea
                  value={auctionForm.description}
                  onChange={(e) => setAuctionForm({...auctionForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  rows={4}
                  placeholder="Describe el estado, características especiales, etc."
                  required
                />
              </div>
            </div>

            <div className="p-8 bg-black">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Configuración de Subasta</h3>
              
              <div className="mb-6">
                <label className="block text-gray-300 font-bold mb-2">Precio Base ($):</label>
                <input
                  type="number"
                  value={auctionForm.basePrice}
                  onChange={(e) => setAuctionForm({...auctionForm, basePrice: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  min="1000"
                  placeholder="10000"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-300 font-bold mb-2">Fecha de Cierre:</label>
                <input
                  type="datetime-local"
                  value={auctionForm.endDate}
                  onChange={(e) => setAuctionForm({...auctionForm, endDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all bg-black text-white"
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <h4 className="text-lg font-bold mb-4 text-gray-200">Imágenes del Vehículo</h4>
              <div className="border-2 border-dashed border-yellow-500 p-8 text-center bg-black rounded-xl mb-8">
                <Car className="h-16 w-16 text-white mx-auto mb-4" />
                <p className="text-gray-300 mb-4 font-medium">Arrastra las imágenes aquí o</p>
                <button
                  type="button"
                  className="bg-gradient-to-r from-black to-neutral-900 text-white px-6 py-3 rounded-lg hover:from-neutral-900 hover:to-neutral-700 transition-all font-bold shadow-lg border-2 border-yellow-500"
                >
                  Seleccionar Archivos
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-black to-neutral-900 text-white py-4 rounded-xl hover:from-neutral-900 hover:to-neutral-700 transition-all font-bold text-lg shadow-lg transform hover:scale-105 border-2 border-yellow-500"
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

  const handleBid = (e) => {
    e.preventDefault();
    if (!selectedAuction || !bidAmount) return;

    const minBid = (selectedAuction.currentBid || selectedAuction.basePrice) + 50;
    const bid = parseFloat(bidAmount);

    if (bid < minBid) {
      alert(`La puja debe ser al menos $${minBid}`);
      return;
    }

    const updatedAuction = {
      ...selectedAuction,
      currentBid: bid,
      lastBidder: user.name,
    };

    setAuctions((prev) =>
      prev.map((a) => (a.id === selectedAuction.id ? updatedAuction : a))
    );
    setSelectedAuction(updatedAuction);
    setBidAmount('');
    alert('¡Puja realizada con éxito!');
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
