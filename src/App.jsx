import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from 'react-bootstrap/Carousel';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: "love-lobby.firebaseapp.com",
  projectId: "love-lobby"
});

function App() {
// const [name, setName] = useState('');
// const [email, setEmail] = useState('');
// const [user, setUser] = useState([]);
const [timerData, setTimerData] = useState([]);
const [loading, setLoading] = useState(true);
const [isSwitching, setIsSwitching] = useState(false); 
const [currentDateId, setCurrentDateId] = useState('initialDate1');
const [timeElapsed, setTimeElapsed] = useState({
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
});
const db = getFirestore(firebaseApp);
// const usersCollection = collection(db, 'users');
const datesCollection = collection(db, "date");

// useEffect(() => {
//   const getUsers = async () => {
//     const data = await getDocs(usersCollection);
//     console.log(data);
//     setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//   }
//   getUsers();
// }, []);

  // Fetch dates from Firestore
  useEffect(() => {
    const fetchDates = async () => {
      const data = await getDocs(datesCollection);
      const fetchedData = data.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          initialDate1: docData.initialDate1.toDate(),
          initialDate2: docData.initialDate2.toDate(),
        };
      });
      setTimerData(fetchedData);
      setLoading(false);
    };

    fetchDates();
  }, []);

  // Calculate time elapsed
  useEffect(() => {
    if (!loading && timerData.length > 0) {
      const selectedDate = timerData[0][currentDateId]; // Pega initialDate1 ou initialDate2

      // Exibe o loading durante a troca de data
      setIsSwitching(true);

      // Simula o cálculo e atualiza os valores
      setTimeout(() => {
        const now = new Date();
        const difference = now - selectedDate; // Diferença em milissegundos

        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30); // Aproximadamente 30 dias por mês
        const weeks = Math.floor((totalDays % 30) / 7);
        const days = totalDays % 7;
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        setTimeElapsed({ months, weeks, days, hours });
        setIsSwitching(false); // Remove o loading após atualizar
      }, 500); // Simula um pequeno atraso para o loading
    }
  }, [currentDateId, timerData, loading]);

  // Toggle between initialDate1 and initialDate2
  const toggleDate = () => {
    setCurrentDateId((prev) => (prev === 'initialDate1' ? 'initialDate2' : 'initialDate1'));
  };

  const exibirData1 = "22/06/2024"; // Data inicial 1
  const exibirData2 = "14/09/2024"; // Data inicial 2

  const displayedDate = currentDateId === 'initialDate1' ? exibirData1 : exibirData2;

  // Render component
  return (
    <div>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Carousel>
        <Carousel.Item interval={1000}>
          <img
            className="d-block w-100"
            src="https://breno-dameto.github.io/love-lobby/1.jpeg"
            alt="Slide 1"
            style={{ objectFit: 'contain', height: '400px', width: '110%' }} // Aumenta a largura para 110%
          />
        </Carousel.Item>

        <Carousel.Item interval={1000}>
          <img
            className="d-block w-100"
            src="https://breno-dameto.github.io/love-lobby/2.jpeg"
            alt="Slide 2"
            style={{ objectFit: 'contain', height: '400px', width: '400px' }} // Aumenta a largura para 110%
          />
        </Carousel.Item>

        <Carousel.Item interval={1000}>
          <img
            className="d-block w-100"
            src="https://breno-dameto.github.io/love-lobby/3.jpeg"
            alt="Slide 3"
            style={{ objectFit: 'contain', height: '400px', width: '110%' }} // Aumenta a largura para 110%
          />
        </Carousel.Item>
      </Carousel>
      </div>
  
    <Container className="text-center py-5">
        <h1 className="mb-4">Contagem Regressiva</h1>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : isSwitching ? (
          <Spinner animation="grow" variant="primary" />
        ) : (
          <>
          <div className="mt-3 mb-2">
            <h4 className='fs-5'>Juntos desde: {displayedDate}</h4>
          </div>
          <Row className="gy-3 justify-content-center align-items-center">
            {["Meses", "Semanas", "Dias", "Horas"].map((label, index) => (
              <Col key={index} xs={12} sm={6} md={3} className="d-flex justify-content-center">
                <Card
                  bg="dark"
                  text="white"
                  className="shadow p-3"
                  style={{
                    minHeight: '200px',  // altura mínima para o card
                    maxHeight: '250px',  // altura máxima
                    width: '250px',      // largura fixa para todos os cards
                    overflow: 'hidden'   // Garantir que o conteúdo não transborde
                  }}
                >
                  <Card.Body>
                    <Card.Title>{label}</Card.Title>
                    <Card.Text className="fs-4">
                      {Object.values(timeElapsed)[index]}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
            {/* Botão para alternar as datas */}
            <div>
              <p className="mt-4">Prefere a outra data?</p>
            <Button variant="dark" onClick={toggleDate}>
              Trocar Data
            </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
export default App;