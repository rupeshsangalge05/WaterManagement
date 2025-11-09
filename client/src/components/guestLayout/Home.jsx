import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { Container } from 'react-bootstrap';

import Slider from './Slider';
import Features from './Features';
import Blog from './Blog';
import Counter from './Counter';
import Services from './Services';
import WaterSources from './WaterSources';
import Timetable from './TimeTable';
import WaterQualityChart from './WaterQuality';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const section = location.state?.scrollTo;
    if (section) {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: -70,
      });
    }
  }, [location]);

  return (
    <div style={{ borderRadius: '1rem' }} className='my-5 mt-5'>
      {/* Slider - usually full width */}
      <section className="rounded">
        <Slider />
      </section>

      {/* Responsive content sections */}
      <section className="rounded" style={sectionStyle1} >
        <Container>
          <WaterSources />
        </Container>
      </section>

      <section className="rounded" style={sectionStyle} >
        <Container>
          {/* <WaterQualityChart /> */}
        </Container>
      </section>

      <section className="rounded" style={sectionStyle1}>
        <Container>
          <Timetable />
        </Container>
      </section>

      <section className="rounded" style={sectionStyle}>
        <Container>
          <Services />
        </Container>
      </section>

      <section className="rounded" style={sectionStyle1}>
        <Container>
          <Features />
        </Container>
      </section>

      <section className="rounded" style={sectionStyle}>
        <Container>
          <Counter />
        </Container>
      </section>

      <section className="rounded" style={sectionStyle1}>
        <Container>
          <Blog />
        </Container>
      </section>
    </div>
  );
};

const sectionStyle = {
  borderRadius: '1rem',
  backgroundColor: 'white'
};
const sectionStyle1 = {
  borderRadius: '1rem',
  backgroundColor: '#f8f9fa'
};

export default Home;
