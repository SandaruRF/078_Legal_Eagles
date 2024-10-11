import React, { useState, useEffect ,useContext} from 'react';
import { ThemeContext } from "../ThemeContext";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import winner1 from '../images/winner1.jpg';
import winner2 from '../images/winner2.jpg';
import winner3 from '../images/winner3.jpg';
import './winner.css'; 

function BasicExample() {
  const { theme } = useContext(ThemeContext);
  const images = [winner1, winner2, winner3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [validVotesCount, setValidVotesCount] = useState(0);
  const totalVotes = 5634915;
  const totalValidVotes = 13319616;

  useEffect(() => {
    const incrementVoteCount = () => {
      const increment = Math.ceil(totalVotes / 200);
      const intervalId = setInterval(() => {
        setVoteCount((prevCount) => {
          if (prevCount + increment >= totalVotes) {
            clearInterval(intervalId);
            return totalVotes;
          }
          return prevCount + increment;
        });
      }, 500);

      return () => clearInterval(intervalId);
    };

    incrementVoteCount();

    const imageIntervalId = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(false);
      }, 500);
    }, 3000);

    return () => {
      clearInterval(imageIntervalId);
    };
  }, [images]);

  useEffect(() => {
    const incrementValidVotesCount = () => {
      const increment = Math.ceil(totalValidVotes / 80);
      let currentCount = 0;

      const intervalId = setInterval(() => {
        if (currentCount < totalValidVotes) {
          currentCount += increment;
          setValidVotesCount(Math.min(currentCount, totalValidVotes));
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            setValidVotesCount(0);
            incrementValidVotesCount();
          }, 6000);
        }
      }, 100);

      return () => clearInterval(intervalId);
    };

    incrementValidVotesCount();
  }, [totalValidVotes]);

  // Set colors based on theme
  const backgroundColor = theme === 'dark' ? '#303030' : '#F0F0F0'; 
  const winnerTextColor = theme === 'dark' ? '#66FF66' : '#00B300'; 
  const voteCountColor = theme === 'dark' ? '#FF0F61' : '#C80C4C'; 
  const validVotesColor = theme === 'dark' ? '#FF0F61' : '#C80C4C'; 
  const otherTextColor = theme === 'dark' ? 'white' : 'black'; 
  const cardBorderColor = theme === 'dark' ? 'white' : 'transparent'; 

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="custom-card cardd" style={{ borderColor: cardBorderColor, borderWidth: '2px', borderStyle: 'solid', backgroundColor }}>
            <Card.Img variant="top" src={images[currentIndex]} className={fade ? 'fade-out' : 'fade-in'} />
            <Card.Body>
              <center>
                <Card.Title>
                  <p id="title" style={{ color: winnerTextColor }}>Winner</p>
                </Card.Title>
              </center>
              <Card.Text>
                <h1 class="head" style={{ color: voteCountColor }}>Received Votes {voteCount.toLocaleString()}</h1> 
                <p id="desc"  className="description" style={{ color: otherTextColor }}>
                  Honourable<br /> Anura Kumara Dissanayake<br />
                </p>
                <p id="desc" className="description" style={{ color: otherTextColor }}>
                  9th Executive President of the Democratic Socialist Republic of Sri Lanka
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
          <h1 class="head" id="validVotes" style={{ color: validVotesColor }}>Total Valid Votes {validVotesCount.toLocaleString()}</h1>
        </Col>
      </Row>
    </Container>
  );
}

export default BasicExample;
