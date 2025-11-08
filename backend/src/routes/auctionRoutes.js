const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { authenticate, esVendedor, optionalAuth, esComprador } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { validateCreateAuction, validateId, validateSearchAuctions } = require('../utils/validators');

console.log('Funciones disponibles:', Object.keys(auctionController));

// GET /api/auctions - Obtener todas las subastas activas (público)
router.get('/', optionalAuth, auctionController.getAllAuctions);

// GET /api/auctions/search - Buscar subastas con filtros
router.get('/search', validateSearchAuctions, validate, auctionController.searchAuctions);

// GET /api/auctions/my-auctions - Obtener mis subastas (requiere ser vendedor)
router.get('/my-auctions', authenticate, esVendedor, auctionController.getMyAuctions);

// GET /api/auctions/:id - Obtener subasta por ID
router.get('/:id', validateId, validate, auctionController.getAuctionById);

// POST /api/auctions - Crear subasta (requiere ser vendedor)
router.post('/', authenticate, esVendedor, validateCreateAuction, validate, auctionController.createAuction);

// PUT /api/auctions/:id/cancel - Cancelar subasta (requiere ser el vendedor)
router.put('/:id/cancel', authenticate, esVendedor, validateId, validate, auctionController.cancelAuction);

// PUT /api/auctions/:id/close - Cerrar subasta (para admin o proceso automático)
router.put('/:id/close', authenticate, validateId, validate, auctionController.closeAuction);

const getAllAuctions = async (req, res) => {
        try {
          const auctions = await Auction.findAll({
            where: { status: 'active', end_time: { [Op.gt]: new Date() } },
            include: [{ model: User, as: 'vendedor', attributes: ['username'] }]
          });
          res.json(auctions);
        } catch (error) {
          console.error('Error in getAllAuctions:', error);
          res.status(500).json({ error: 'Failed to fetch auctions' });
        }
      };

module.exports = router;