const router = require('express').Router();
const mongoose = require('mongoose');
const Car = require('../models/Car');
const wrap = require('../utils/wrap');
const validId = (req, res, next) => mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ error: 'Invalid car ID' });
const jsonOnly = (req, res, next) => req.is('application/json') ? next() : res.status(415).json({ error: 'Content-Type must be application/json' });
const valid = (req, res, next) => {
    if (typeof req.body.title !== 'string' || !req.body.title.trim() || !Number.isFinite(Number(req.body.price)) || Number(req.body.price) <= 0)
        return res.status(400).json({ error: 'Title and positive price required' });
    next();
};
const input = b => ({ title: b.title, brand: b.brand, description: b.description, price: b.price, year: b.year, priority: b.priority });
router.get('/', wrap(async (req, res) => res.json(await Car.find().sort({ createdAt: -1 }))));
router.get('/:id', validId, wrap(async (req, res) => { const car = await Car.findById(req.params.id); return car ? res.json(car) : res.status(404).json({ error: 'Car not found' }); }));
router.post('/', jsonOnly, valid, wrap(async (req, res) => { const car = await Car.create({ ...input(req.body), owner: null }); res.status(201).json(car); }));
router.put('/:id', validId, jsonOnly, valid, wrap(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (!car)
        return res.status(404).json({ error: 'Car not found' });
    Object.assign(car, input(req.body));
    await car.save();
    res.json(car);
}));
router.delete('/:id', validId, wrap(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (!car)
        return res.status(404).json({ error: 'Car not found' });
    await car.deleteOne();
    res.json({ success: true });
}));
module.exports = router;
