const { io } = require("../index");
const Bands = require("../models/bands");
const Band = require("../models/band");

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Metallica'));
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('Skillet'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log("Cliente conectado");

    client.emit('active-bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log("Cliente desconectado");
    });

    client.on('mensaje', ( payload ) => {
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands() );
    });

    client.on('new-band', (payload) => {
        const band = new Band(payload.name);
        bands.addBand(band);
        io.emit('active-bands', bands.getBands() );
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands() );
    });
    
    client.on('emitir-mensaje', ( payload ) => {
        client.broadcast.emit('nuevo-mensaje', payload);
    });

});
