import express from "express";
import jwt from "jsonwebtoken";
import { Article, sequelize } from "../models/index.js";
import { transliterate } from "transliteration";
import "dotenv/config";

export default class ArticleController {
  static async index(req, res) {
    const articles = await Article.findAll();
    res.json(articles);
  }
  static async create(req, res) {
    const { title, content } = req.body;
    const link = transliterate(title, { unknown: "-" })
      .toLowerCase()
      .replace(/\s+/g, "-");

    const article = await Article.create({
      title,
      link,
      content,
      UserId: req.userId,
    });
    res.status(201).json(article);
  }
  static async edit(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    const article = await Article.findOne({
      where: { id, UserId: req.userId },
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const link = transliterate(title, { unknown: "-" })
      .toLowerCase()
      .replace(/\s+/g, "-");

    article.title = title;
    article.link = link;
    article.content = content;
    await article.save();

    res.json(article);
  }
  static async getBySlug(req, res) {
    const { slug } = req.params;
    res.json(slug); 
  }
  static async delete(req, res) {
    const { id } = req.params;
    const article = await Article.findOne({
      where: { id, UserId: req.userId },
    });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    await article.destroy();
    res.json({ message: "Article deleted successfully" });
  }
}
