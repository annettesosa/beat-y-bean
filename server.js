require('dotenv').config();
const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
app.use(require('cors')());
app.use(express.static('public'));

let db = JSON.parse(fs.readFileSync('database.json','utf8'));

// Guardar usuarios
app.post('/api/register', (req,res)=>{
  const {name,email,pass} = req.body;
  if(db.users.find(u=>u.email===email)) return res.json({message:'Ya existe ese usuario'});
  db.users.push({name,email,pass});
  fs.writeFileSync('database.json',JSON.stringify(db,null,2));
  res.json({message:'Usuario registrado correctamente'});
});

// Iniciar sesión
app.post('/api/login', (req,res)=>{
  const {email,pass} = req.body;
  const user = db.users.find(u=>u.email===email && u.pass===pass);
  if(user) res.json({message:'Inicio de sesión exitoso'});
  else res.json({message:'Datos incorrectos'});
});

// Reservar y verificar disponibilidad
app.post('/api/reserve', (req,res)=>{
  const {type,date} = req.body;
  const conflict = db.reservas.find(r=>r.type===type && r.date===date);
  if(conflict) return res.json({message:'Esa hora ya está ocupada 😔'});
  db.reservas.push({type,date});
  fs.writeFileSync('database.json',JSON.stringify(db,null,2));
  sendMail(`Nueva reserva de ${type} para ${date}`);
  res.json({message:'Reservación confirmada ✔️ Se ha enviado correo'});
});

// Envío de correo (usa Gmail o SMTP)
function sendMail(msg){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  transporter.sendMail({
    from: `"Beat&Bean" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Nueva reserva Beat&Bean',
    text: msg
  });
}

app.listen(3000, ()=> console.log('Servidor en http://localhost:3000'));
