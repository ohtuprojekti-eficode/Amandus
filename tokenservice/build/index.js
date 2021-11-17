"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express = require('express');
const app = express();
let tokens = [
    { id: 1, token: 'a' },
    { id: 2, token: 'b' },
    { id: 3, token: 'c' },
    { id: 4, token: 'd' }
];
app.get('/', (req, res) => {
    res.send('<H1>Token service<H1>');
});
app.get('/api/tokens', (req, res) => {
    res.json(tokens);
});
app.get('/api/tokens/:id', (req, res) => {
    console.log(`Got params: ${req.params.id}`);
    const id = Number(req.params.id);
    if (!tokens) {
        return;
    }
    const token = tokens.find(t => t.id === id);
    if (token) {
        express_1.response.json(token);
    }
    else {
        express_1.response.status(404).end;
    }
});
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
