const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET ALL SEO BLOG POSTS
 */
router.get('/', async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

/**
 * GET SINGLE BLOG BY SLUG
 */
router.get('/:slug', async (req, res) => {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug }
    });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
});

module.exports = router;
