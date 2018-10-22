const express = require('express');
const router = express.Router();
const IngredientTagCtrl = require('../controllers/IngredientTagCtrl');
const wrap = require('express-async-wrap');

/* 쿼리(type => search)에 맞는 레시피 리스트 응답 API */
router.get('/', wrap(IngredientTagCtrl.searchRecipeByTag));

module.exports = router;