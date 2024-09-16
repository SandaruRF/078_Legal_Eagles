import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../images/ai.gif";
import loadingImg from "../images/loading.gif";
import person1 from "../images/ranil.png";
import person2 from "../images/anura.png";
import person3 from "../images/sajith.png";
import person4 from "../images/namal.png";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


export const Banner = ({ onShowChart, isChartLoaded}) => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [ "Potential Candidates" ];
  const period = 2000;
  const [gifUrl, setGifUrl] = useState(headerImg);
  const [loadingState, setLoadingState] = useState(false); 

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  const handleButtonClick = () => {
    if (!loadingState) {
      setGifUrl(loadingImg); 
      setLoadingState(true); 
      onShowChart();
    }
  };


  useEffect(() => {
    if (isChartLoaded && loadingState) {
      setGifUrl(headerImg); 
      setLoadingState(false);
    }
  }, [isChartLoaded, loadingState]); 


  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }
 
  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
          
                <h1><span className="txt-rotate" dataPeriod="1000" data-rotate='[ "Potential Candidates" ]'><span className="wrap">{text}</span></span></h1>
                <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={2000} className="owl-carousel owl-theme skill-slider">
                            <div className="item">
                                <img src={person1} alt="Image" />
                                <h5>Ranil Wickremesinghe</h5>
                            </div>
                            <div className="item">
                                <img src={person2} alt="Image" />
                                <h5>Anura Kumara</h5>
                            </div>
                            <div className="item">
                                <img src={person3} alt="Image" />
                                <h5>Sajith Premadasa</h5>
                            </div>
                            <div className="item">
                                <img src={person4} alt="Image" />
                                <h5>Namal Rajapaksa</h5>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    </section>
            <span className="predictButtn">
                <button onClick={handleButtonClick} className="vvd"><span>Predict the Winner</span></button>
            </span>
          </Col>
          <Col xs={12} md={6} xl={5}>
                  <img src={gifUrl} alt="Header Img"/>
          </Col>
        </Row>
      </Container>
    </section>
  )
}