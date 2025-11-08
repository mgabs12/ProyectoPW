const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// Crear subasta (solo vendedores)
exports.createAuction = async (req, res) => {
  try {
    const { title, brand, model, year, description, base_price, end_time } = req.body;

    let image_url = null;
    if (req.files && req.files.length > 0) {
      image_url = `/uploads/vehicles/${req.files[0].filename}`;
    }

    // Validar que endDate sea una fecha válida
    const endTime = new Date(endDate);
    if (isNaN(endTime.getTime())) {
      return res.status(400).json({
        error: 'Fecha de finalización inválida.'
      });
    }

    // Validar que la fecha sea futura
    if (endTime <= new Date()) {
      return res.status(400).json({
        error: 'La fecha de finalización debe ser futura.'
      });
    }

    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      // Tomar la primera imagen como principal
      // En producción, puedes guardar todas en una tabla separada
      image_url = `/uploads/vehicles/${req.files[0].filename}`;
    }

    const auctionId = await Auction.create({
      title,
      brand,
      model,
      year: parseInt(year),
      description,
      base_price: parseFloat(basePrice),
      end_time: endTime,
      image_url: image_url || null,
      vendedor_id: req.user.id
    });

    const auction = await Auction.findById(auctionId);

    res.status(201).json({
      message: 'Subasta creada exitosamente',
      auction
    });
    
  } catch (error) {
    console.error('Error al crear subasta:', error);
    res.status(500).json({
      error: 'Error al crear subasta.',
      details: error.message
    });
  }
};

// Obtener todas las subastas activas
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findAllActive();

    // Formatear las subastas para el frontend
    const formattedAuctions = auctions.map(auction => ({
      id: auction.id,
      title: auction.title,
      brand: auction.brand,
      model: auction.model,
      year: auction.year,
      description: auction.description,
      basePrice: parseFloat(auction.base_price),
      currentBid: parseFloat(auction.current_bid),
      endTime: auction.end_time,
      endDate: auction.end_time, // Para compatibilidad con frontend
      vendedor: `${auction.seller_name} ${auction.seller_lastname}`,
      vendedor_id: auction.vendedor_id,
      status: auction.status === 'activo' ? 'active' : auction.status,
      imageUrl: auction.image_url,
      bidCount: auction.bid_count || 0
    }));

   res.json({
      count: auctions.length,
      auctions
    });
  } catch (error) {
    console.error('Error al obtener subastas:', error);
    res.status(500).json({
      error: 'Error al obtener subastas.'
    });
  }
};

// Obtener subasta por ID
exports.getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({
        error: 'Subasta no encontrada.'
      });
    }

    // Obtener historial de pujas
    const bids = await Bid.findByAuction(id);

    // Formatear para el frontend
    const formattedAuction = {
      id: auction.id,
      title: auction.title,
      brand: auction.brand,
      model: auction.model,
      year: auction.year,
      description: auction.description,
      basePrice: parseFloat(auction.base_price),
      currentBid: parseFloat(auction.current_bid),
      endTime: auction.end_time,
      endDate: auction.end_time,
      vendedor: `${auction.seller_name} ${auction.seller_lastname}`,
      vendedor_id: auction.vendedor_id,
      status: auction.status === 'activo' ? 'active' : auction.status,
      imageUrl: auction.image_url,
      bidCount: auction.bid_count || 0,
      sellerInfo: {
        name: auction.seller_name,
        lastname: auction.seller_lastname,
        email: auction.seller_email,
        phone: auction.seller_phone
      }
    };

    res.json({
      auction: formattedAuction,
      bids
    });
  } catch (error) {
    console.error('Error al obtener subasta:', error);
    res.status(500).json({
      error: 'Error al obtener subasta.',
      details: error.message
    });
  }
};

// Buscar subastas con filtros
exports.searchAuctions = async (req, res) => {
  try {
    const filters = {
      brand: req.query.brand,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      year: req.query.year
    };

    const auctions = await Auction.search(filters);

    const formattedAuctions = auctions.map(auction => ({
      id: auction.id,
      title: auction.title,
      brand: auction.brand,
      model: auction.model,
      year: auction.year,
      basePrice: parseFloat(auction.base_price),
      currentBid: parseFloat(auction.current_bid),
      endTime: auction.end_time,
      vendedor: `${auction.seller_name} ${auction.seller_lastname}`,
      status: auction.status === 'activo' ? 'active' : auction.status,
      bidCount: auction.bid_count || 0
    }));

    res.json({
      count: formattedAuctions.length,
      filters,
      auctions: formattedAuctions
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      error: 'Error al buscar subastas.',
      details: error.message
    });
  }
};

// Obtener subastas del vendedor autenticado
exports.getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findBySeller(req.user.id);

    const formattedAuctions = auctions.map(auction => ({
      id: auction.id,
      title: auction.title,
      brand: auction.brand,
      model: auction.model,
      year: auction.year,
      basePrice: parseFloat(auction.base_price),
      currentBid: parseFloat(auction.current_bid),
      endTime: auction.end_time,
      status: auction.status === 'activo' ? 'active' : auction.status,
      bidCount: auction.bid_count || 0
    }));

    res.json({
      count: formattedAuctions.length,
      auctions: formattedAuctions
    });
  } catch (error) {
    console.error('Error al obtener mis subastas:', error);
    res.status(500).json({
      error: 'Error al obtener tus subastas.',
      details: error.message
    });
  }
};

// Cancelar subasta (solo el vendedor)
exports.cancelAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({
        error: 'Subasta no encontrada.'
      });
    }

    // Verificar que sea el dueño
    if (auction.vendedor_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permiso para cancelar esta subasta.'
      });
    }

    // Verificar que esté activa
    if (auction.status !== 'activo') {
      return res.status(400).json({
        error: 'Solo se pueden cancelar subastas activas.'
      });
    }

    await Auction.cancel(id);

    res.json({
      message: 'Subasta cancelada exitosamente'
    });
  } catch (error) {
    console.error('Error al cancelar subasta:', error);
    res.status(500).json({
      error: 'Error al cancelar subasta.',
      details: error.message
    });
  }
};

// Cerrar subasta automáticamente (cron job o manual)
exports.closeAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({
        error: 'Subasta no encontrada.'
      });
    }

    // Verificar que el tiempo haya expirado
    const now = new Date();
    const endTime = new Date(auction.end_time);

    if (now < endTime) {
      return res.status(400).json({
        error: 'La subasta aún no ha finalizado.'
      });
    }

    // Obtener ganador (puja más alta)
    const highestBid = await Bid.getHighestBid(id);
    const winnerId = highestBid ? highestBid.user_id : null;

    await Auction.close(id, winnerId);

    res.json({
      message: 'Subasta cerrada exitosamente',
      winner_id: winnerId,
      winning_bid: highestBid ? highestBid.amount : null
    });
  } catch (error) {
    console.error('Error al cerrar subasta:', error);
    res.status(500).json({
      error: 'Error al cerrar subasta.',
      details: error.message
    });
  }
};