// 1 - Invocamos a express
const express = require('express');
const app = express(); 

// 2 - Seteamos urlencoded para capturar datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 3 - Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

// 4 - El directorio public
app.use('/resources', express.static('public'));

// 5 - Establecer el motor de plantillas
app.set('view engine', 'ejs');

// 6 - Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

// 7 - Var. de sesión
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// 8 - Invocamos el módulo de conexión de la base de datos
const connection = require('./database/db');

// 9 - Establecemos las rutas
app.get('/loginandregister', (req, res) => {
    res.render('loginandregister');
});

// 10 - Ruta para el registro
app.post('/register', async (req, res) => {
    const { name, email, pass } = req.body;
    try {
        const passwordHash = await bcryptjs.hash(pass, 8);
        connection.query('INSERT INTO users SET ?', { name, email, pass: passwordHash }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error en el registro');
            } else {
                res.render('loginandregister', {
                    alert: true,
                    alertTitle: "Registro",
                    alertMessage: "Registro exitoso",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// 11 - Ruta para el login
app.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error en el login');
            }

            if (results.length === 0) {
                return res.render('loginandregister', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Email o contraseña incorrectos",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'loginandregister'
                });
            }

            const user = results[0];
            const isMatch = await bcryptjs.compare(pass, user.pass);

            if (isMatch) {
                req.session.loggedin = true;
                req.session.name = user.name; // Guardar el nombre del usuario en la sesión
                res.render('loginandregister', {
                    alert: true,
                    alertTitle: "Conexión exitosa",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            } else {
                res.render('loginandregister', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Email o contraseña incorrectos",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'loginandregister'
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// 12 - Autenticación para las demás páginas
app.get('/', (req, res) => {
    res.render('index', {
      login: req.session.loggedin || false,
      name: req.session.loggedin ? req.session.name : 'Debe iniciar sesión'
    });
  });
  
  // 13 - Logout
  app.get('/logout', (req, res) => {
    req.session.destroy(()=>{
      res.redirect('/');
    });
  }); 
  
  // Iniciar el servidor
  app.listen(3000, () => {
    console.log('SERVER RUNNING IN http://localhost:3000');
  }); 