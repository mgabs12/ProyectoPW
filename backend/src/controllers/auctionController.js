const Auction = require('../models/Auction');
const Bid = require('../models/Bid');


// Crear subasta (solo vendedores)
exports.createAuction = async (req, res) => {
  try {
    const { title, brand, model, year, description, base_price, end_time, image_url } = req.body;

    const auctionId = await Auction.create({
      title,
      brand,
      model,
      year,
      description,
      base_price,
      end_time,
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
      error: 'Error al crear subasta.'
    });
  }
};

// Obtener todas las subastas activas
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findAllActive();

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

    res.json({
      auction,
      bids
    });
  } catch (error) {
    console.error('Error al obtener subasta:', error);
    res.status(500).json({
      error: 'Error al obtener subasta.'
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

    res.json({
      count: auctions.length,
      filters,
      auctions
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      error: 'Error al buscar subastas.'
    });
  }
};

// Obtener subastas del vendedor autenticado
exports.getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findBySeller(req.user.id);

    res.json({
      count: auctions.length,
      auctions
    });
  } catch (error) {
    console.error('Error al obtener mis subastas:', error);
    res.status(500).json({
      error: 'Error al obtener tus subastas.'
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
      error: 'Error al cancelar subasta.'
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
      error: 'Error al cerrar subasta.'
    });
  }
};
