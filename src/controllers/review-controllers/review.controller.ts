
import { Request, Response } from 'express';
import Review from '../../models/review-model/review.model.js';
import User from '../../models/user-model/user.model.js';
import Terrace from '../../models/terrace-model/db/terrace-model-sequelize.js';
import '../../models/associations/associations.ts'
//import supabaseAdmin from '../config/supabase-admin.js';

import { reviewSchema } from '../../models/review-model/zod/review-schema.js';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.findAll(/* {
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
    } */);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const postReview = async (req: Request, res: Response) => {
  try {
    // 1. Validació amb Zod
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { rating, comment, userId, terraceId } = parsed.data;

    // 2. Comprova si l'usuari i la terrassa existeixen
    const user = await User.findByPk(userId,{
      attributes: ['id', 'email', 'name'], // només els camps que existeixen a Supabase
    });
    const terrace = await Terrace.findByPk(terraceId, {
      attributes: ['id', 'business_name', 'cadastro_ref'], // només els camps que existeixen a Supabase
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!terrace) {
      return res.status(404).json({ error: 'Terrace not found' });
    }

    // 3. Crea la review
    const review = await Review.create({
      rating,
      comment,
      userId,
      userName: user.name, // opcional, però si existeix, l'afegim
      terraceId,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// config/supabase-admin.ts //PARA QUE FUNCIONE EL DELETE NECESITO ESTO EN EL SERVIDOR:
/* import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ NOMÉS al servidor!
);

export default supabaseAdmin; */

export const deleteReview =  async (req: Request, res: Response) => {
    return res.status(503).json({ error: 'deleteReview is temporarily disabled by Carles' });

  const { id } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Validem el token i obtenim el Firebase UID
    const decoded = await admin.auth().verifyIdToken(token); /* !!aquesta linea em dona error al admin!!! */
    const uid = decoded.uid;

    // 2. Busquem la review
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // 3. Comprovem que l'autor sigui el mateix que el UID
    if (review.userId !== uid) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    // 4. Eliminem
    await review.destroy();

    return res.status(200).json({ message: 'Review deleted successfully' });

  } catch (err) {
    console.error('Error deleting review:', err);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
};
