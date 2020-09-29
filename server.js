const express = require ('express'); 
const connectDB = require ('./config/db');

const app = express(); 
connectDB(); 

app.use(express.json ({extended: false}));
app.get('/', (req, res) => res.send('API Running')); 


app.use('/api/users', require ('./routes/api/users'));
app.use('/services/login', require ('./routes/services/login'));

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`Server started in port ${PORT}`)); 
