import React, { useState, useEffect } from 'react';
import { Clock, User, Car, Gavel, Heart, Plus, Search, Bell, LogOut } from 'lucide-react';

// Mock data
const mockAuctions = [
  {
    id: 1,
    title: 'Toyota Camry 2020',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    basePrice: 15000,
    currentBid: 17500,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
    image: '/api/placeholder/300/200',
    seller: 'María González',
    status: 'active'
  },
  {
    id: 2,
    title: 'Honda Civic 2019',
    brand: 'Honda',
    model: 'Civic',
    year: 2019,
    basePrice: 12000,
    currentBid: 13750,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 horas
    image: '/api/placeholder/300/200',
    seller: 'Carlos Mendoza',
    status: 'active'
  },
  {
    id: 3,
    title: 'Ford Mustang 2018',
    brand: 'Ford',
    model: 'Mustang',
    year: 2018,
    basePrice: 20000,
    currentBid: 22500,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 día
    image: '/api/placeholder/300/200',
    seller: 'Ana López',
    status: 'active'
  }
];

const CarBid = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [auctions, setAuctions] = useState(mockAuctions);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    firstName: '', lastName: '', email: '', password: '', phone: '' 
  });

  // Timer para actualizar el tiempo restante
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prev => [...prev]); // Forzar re-render para actualizar tiempo
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

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

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login
    setUser({
      id: 1,
      name: 'Juan Pérez',
      email: loginForm.email,
      role: 'both'
    });
    setCurrentView('dashboard');
    setLoginForm({ email: '', password: '' });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Mock register
    setUser({
      id: 1,
      name: `${registerForm.firstName} ${registerForm.lastName}`,
      email: registerForm.email,
      role: 'both'
    });
    setCurrentView('dashboard');
    setRegisterForm({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  };

  const handleBid = (e) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= selectedAuction.currentBid) return;
    
    // Mock bid
    const updatedAuctions = auctions.map(auction =>
      auction.id === selectedAuction.id
        ? { ...auction, currentBid: parseFloat(bidAmount) }
        : auction
    );
    
    setAuctions(updatedAuctions);
    setSelectedAuction({ ...selectedAuction, currentBid: parseFloat(bidAmount) });
    setBidAmount('');
    alert('¡Puja realizada exitosamente!');
  };

  const Header = () => (
    <header className="bg-blue-700 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 
            className="text-2xl font-bold cursor-pointer flex items-center gap-2"
            onClick={() => setCurrentView('home')}
          >
            <Car className="h-8 w-8" />
            CarBid
          </h1>
          {user && (
            <nav className="flex gap-6 ml-8">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`hover:text-blue-200 ${currentView === 'dashboard' ? 'text-blue-200' : ''}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('auctions')}
                className={`hover:text-blue-200 ${currentView === 'auctions' ? 'text-blue-200' : ''}`}
              >
                Subastas
              </button>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Bell className="h-6 w-6 cursor-pointer hover:text-blue-200" />
              <User className="h-6 w-6" />
              <span>{user.name}</span>
              <button 
                onClick={() => {setUser(null); setCurrentView('home');}}
                className="hover:text-blue-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
              >
                Registro
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Subastas de Vehículos en Tiempo Real</h1>
          <p className="text-xl mb-8 text-blue-100">
            Compra y vende vehículos de manera segura y transparente
          </p>
          <button 
            onClick={() => setCurrentView('auctions')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Ver Subastas Activas
          </button>
        </div>
      </div>

      {/* Auctions Grid */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Subastas Activas</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {auctions.slice(0, 3).map(auction => (
            <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Car className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{auction.title}</h3>
                <p className="text-green-600 font-bold text-lg mb-1">
                  Puja actual: ${auction.currentBid.toLocaleString()}
                </p>
                <p className="text-orange-600 font-semibold mb-4">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Termina: {formatTimeRemaining(auction.endTime)}
                </p>
                <button 
                  onClick={() => {
                    setSelectedAuction(auction);
                    setCurrentView('auction-detail');
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Contraseña:</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-center mt-4">
          ¿No tienes cuenta?{' '}
          <button 
            onClick={() => setCurrentView('register')}
            className="text-blue-600 hover:underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );

  const RegisterPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre:</label>
            <input
              type="text"
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Apellido:</label>
            <input
              type="text"
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña:</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Teléfono:</label>
            <input
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors font-semibold"
          >
            Crear Cuenta
          </button>
        </form>
        <p className="text-center mt-4">
          ¿Ya tienes cuenta?{' '}
          <button 
            onClick={() => setCurrentView('login')}
            className="text-blue-600 hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Bienvenido, {user?.name}</h1>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-blue-600">5</h3>
            <p className="text-gray-600">Pujas Activas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-green-600">2</h3>
            <p className="text-gray-600">Subastas Ganadas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-purple-600">3</h3>
            <p className="text-gray-600">Vehículos Vendidos</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
            <button 
              onClick={() => setCurrentView('create-auction')}
              className="w-full bg-green-600 text-white py-3 rounded mb-3 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Crear Subasta
            </button>
            <button 
              onClick={() => setCurrentView('auctions')}
              className="w-full bg-gray-600 text-white py-3 rounded hover:bg-gray-700 transition-colors"
            >
              Ver Mis Pujas
            </button>
            
            <h4 className="text-lg font-semibold mt-6 mb-3">Notificaciones</h4>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm mb-1">Nueva puja en Toyota Camry</p>
              <p className="text-xs text-gray-500">Hace 5 minutos</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Mis Subastas Recientes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {auctions.slice(0, 2).map(auction => (
                <div key={auction.id} className="border rounded-lg p-4">
                  <div className="h-24 bg-gray-200 rounded mb-3 flex items-center justify-center">
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="font-bold">{auction.title}</h4>
                  <p className="text-sm text-gray-600">Estado: Activa</p>
                  <p className="text-green-600 font-semibold">
                    Puja actual: ${auction.currentBid.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AuctionDetail = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <button 
          onClick={() => setCurrentView('auctions')}
          className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
        >
          ← Volver a subastas
        </button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">{selectedAuction?.title}</h1>
            
            {/* Image Gallery */}
            <div className="bg-gray-200 h-80 rounded-lg mb-6 flex items-center justify-center">
              <Car className="h-32 w-32 text-gray-400" />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded flex items-center justify-center">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Especificaciones</h3>
                <ul className="space-y-2">
                  <li><strong>Marca:</strong> {selectedAuction?.brand}</li>
                  <li><strong>Modelo:</strong> {selectedAuction?.model}</li>
                  <li><strong>Año:</strong> {selectedAuction?.year}</li>
                  <li><strong>Kilometraje:</strong> 45,000 km</li>
                  <li><strong>Transmisión:</strong> Automática</li>
                  <li><strong>Combustible:</strong> Gasolina</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Estado del Vehículo</h3>
                <p className="text-gray-700 leading-relaxed">
                  Vehículo en excelente estado, único dueño. Mantenimientos al día, 
                  sin accidentes. Interior impecable, sistema de entretenimiento 
                  actualizado. Llantas nuevas, batería recién cambiada.
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Información del Vendedor</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-bold">{selectedAuction?.seller}</p>
                  <p className="text-gray-600">Vendedor verificado • 4.8/5 ⭐</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bid Panel */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-green-600">
                ${selectedAuction?.currentBid.toLocaleString()}
              </h2>
              <p className="text-gray-600">Puja actual</p>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg mb-6 text-center">
              <p className="font-bold text-orange-700">
                ⏰ Termina en: {formatTimeRemaining(selectedAuction?.endTime)}
              </p>
            </div>

            {user ? (
              <form onSubmit={handleBid}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Tu puja (mínimo ${(selectedAuction?.currentBid + 50)?.toLocaleString()}):
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={selectedAuction?.currentBid + 50}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder={(selectedAuction?.currentBid + 100)?.toString()}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors font-bold text-lg mb-4"
                >
                  <Gavel className="inline h-5 w-5 mr-2" />
                  Realizar Puja
                </button>
              </form>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors font-bold text-lg mb-4"
              >
                Iniciar Sesión para Pujar
              </button>
            )}

            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded hover:bg-blue-50 transition-colors mb-6 flex items-center justify-center gap-2">
              <Heart className="h-5 w-5" />
              Agregar a Favoritos
            </button>

            <h4 className="font-bold mb-3">Historial de Pujas</h4>
            <div className="max-h-48 overflow-y-auto border rounded p-3 bg-gray-50">
              <div className="space-y-3">
                <div className="pb-2 border-b border-gray-200">
                  <p className="font-semibold">${selectedAuction?.currentBid.toLocaleString()} - Carlos M.</p>
                  <p className="text-sm text-gray-500">Hace 5 minutos</p>
                </div>
                <div className="pb-2 border-b border-gray-200">
                  <p className="font-semibold">${(selectedAuction?.currentBid - 250).toLocaleString()} - Ana L.</p>
                  <p className="text-sm text-gray-500">Hace 12 minutos</p>
                </div>
                <div className="pb-2">
                  <p className="font-semibold">${selectedAuction?.basePrice.toLocaleString()} - Precio base</p>
                  <p className="text-sm text-gray-500">Hace 2 días</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Al pujar aceptas los términos y condiciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const AuctionsPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todas las Subastas</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vehículos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            {user && (
              <button 
                onClick={() => setCurrentView('create-auction')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nueva Subasta
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map(auction => (
            <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Car className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{auction.title}</h3>
                <p className="text-gray-600 mb-2">Por: {auction.seller}</p>
                <p className="text-green-600 font-bold text-lg mb-1">
                  Puja actual: ${auction.currentBid.toLocaleString()}
                </p>
                <p className="text-gray-500 mb-1">
                  Precio base: ${auction.basePrice.toLocaleString()}
                </p>
                <p className="text-orange-600 font-semibold mb-4 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTimeRemaining(auction.endTime)}
                </p>
                <button 
                  onClick={() => {
                    setSelectedAuction(auction);
                    setCurrentView('auction-detail');
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Ver Detalles y Pujar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CreateAuction = () => {
    const [auctionForm, setAuctionForm] = useState({
      title: '',
      brand: '',
      model: '',
      year: '',
      description: '',
      basePrice: '',
      endDate: ''
    });

    const handleCreateAuction = (e) => {
      e.preventDefault();
      // Mock create auction
      const newAuction = {
        id: auctions.length + 1,
        ...auctionForm,
        year: parseInt(auctionForm.year),
        basePrice: parseFloat(auctionForm.basePrice),
        currentBid: parseFloat(auctionForm.basePrice),
        endTime: new Date(auctionForm.endDate),
        seller: user.name,
        status: 'active',
        image: '/api/placeholder/300/200'
      };
      
      setAuctions([...auctions, newAuction]);
      alert('¡Subasta creada exitosamente!');
      setCurrentView('dashboard');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Crear Nueva Subasta</h1>
          
          <form onSubmit={handleCreateAuction} className="bg-white rounded-lg shadow p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Información del Vehículo</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Título de la Subasta:</label>
                  <input
                    type="text"
                    value={auctionForm.title}
                    onChange={(e) => setAuctionForm({...auctionForm, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Ej: Toyota Camry 2020 en excelente estado"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Marca:</label>
                  <select
                    value={auctionForm.brand}
                    onChange={(e) => setAuctionForm({...auctionForm, brand: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Modelo:</label>
                  <input
                    type="text"
                    value={auctionForm.model}
                    onChange={(e) => setAuctionForm({...auctionForm, model: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Año:</label>
                  <input
                    type="number"
                    value={auctionForm.year}
                    onChange={(e) => setAuctionForm({...auctionForm, year: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    min="1990"
                    max="2025"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Descripción:</label>
                  <textarea
                    value={auctionForm.description}
                    onChange={(e) => setAuctionForm({...auctionForm, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={4}
                    placeholder="Describe el estado, características especiales, etc."
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6">Configuración de Subasta</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Precio Base ($):</label>
                  <input
                    type="number"
                    value={auctionForm.basePrice}
                    onChange={(e) => setAuctionForm({...auctionForm, basePrice: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    min="1000"
                    placeholder="10000"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Fecha de Cierre:</label>
                  <input
                    type="datetime-local"
                    value={auctionForm.endDate}
                    onChange={(e) => setAuctionForm({...auctionForm, endDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <h4 className="text-lg font-semibold mb-4">Imágenes del Vehículo</h4>
                <div className="border-2 border-dashed border-gray-300 p-8 text-center bg-gray-50 rounded-lg mb-6">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Arrastra las imágenes aquí o</p>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Seleccionar Archivos
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
                >
                  Crear Subasta
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'dashboard': return <Dashboard />;
      case 'auctions': return <AuctionsPage />;
      case 'auction-detail': return <AuctionDetail />;
      case 'create-auction': return <CreateAuction />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      {renderCurrentView()}
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="h-6 w-6" />
            <span className="text-xl font-bold">CarBid</span>
          </div>
          <p>&copy; 2025 CarBid - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default CarBid;