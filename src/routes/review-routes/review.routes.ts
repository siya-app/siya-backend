import express from 'express';
import Review from '../../models/review-model/review.model.js';
import User from '../../models/user-model/user.model.js';
import Terrace from '../../models/terrace-model/db/terrace-model-sequelize.js';

const router = express.Router();

router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'name'], // como la relacion esta hecha puedo obtener info del usuario aunque no este creado en mi model
        },
        {
          model: Terrace,
          attributes: ['id', 'business_name'], //mismo caso que el anterior, puedo obtener info de la terraza aunque no este creada en mi model
        },
      ],
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
