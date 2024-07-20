const {default : express} = await import ('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CREACION DE SERVIDOR
 * @returns
 */
app.listen(8080,console.log("Servidor backend corriendo en el puerto 8080"))