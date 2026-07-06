import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import slider1 from './slider1.webp'
import slider2 from './slider2.webp'
import slider3 from './slider3.webp'

const carouselItems = [
  {
    image: "https://imgs.search.brave.com/sR4oJERn4onDdTNRwxbwGUDqXIy8tED9sQhT6pxwMOY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9y/ZWFsaXN0aWMtd2F0/ZXItZHJvcC13aXRo/LWVjb3N5c3RlbV8y/My0yMTUxMTk2NDQy/LmpwZz9zZW10PWFp/c19oeWJyaWQ",
    // image: {slider1},
    title: "Efficient Water Use",
    heading: "Smart Water Management for a Sustainable Future",
    description: "Effective water management ensures sustainability, conservation, and optimal usage for future generations."
  },
  {
    image: "https://apacnewsnetwork.com/wp-content/uploads/2023/03/8.15-Crore-Rural-Households-Provide-Tap-Water-Connections-in-3.5-Years-Under-Jal-Jeevan-Mission.jpg",
    // image: {slider2},
    title: "Tap Water Access",
    heading: "Empowering Communities Through Clean Water",
    description: "Delivering safe drinking water and building infrastructure for healthy rural living."
  },
  {
    image: "https://apureinstrument.com/wp-content/uploads/2022/07/Municipal-water.png",
    // image: {slider3},
    title: "Sustainable Solutions",
    heading: "Preserving Water for Future Generations",
    description: "Implementing modern strategies to reduce water wastage and enhance conservation efforts."
  }
];

const Home = () => {
  const captionStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '12px',
    padding: '1.5rem',
    maxWidth: '90%',
    margin: 'auto',
  };

  const headingStyle = {
    fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
    fontWeight: '700',
    marginBottom: '1rem',
  };

  const titleStyle = {
    fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  };

  const descriptionStyle = {
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    lineHeight: 1.5,
  };

  return (
    <section id="home" className="position-relative mt-5 rounded">
      <Carousel controls indicators fade>
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 rounded"
              src={item.image}
              alt={`Slide ${index + 1}`}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '90vh',
                maxHeight: '700px'
              }}
            />
            <Carousel.Caption style={captionStyle}>
              <Container className="text-white text-start">
                <h4 style={titleStyle}>{item.title}</h4>
                <h1 style={headingStyle}>{item.heading}</h1>
                <p style={descriptionStyle}>{item.description}</p>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default Home;
