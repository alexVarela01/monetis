'use client';

import { useEffect } from 'react';
import "./page.css";
import HomeNavigation from '../Components/HomeNavigation/HomeNavigation';
import logoImage from '@/public/Logo_white.png';
import Image from 'next/image';
import { IoCodeSlashOutline, IoHappyOutline, IoInformationCircleOutline } from 'react-icons/io5';


export default function About() {
  const curYear = new Date().getFullYear();

  useEffect(() => {
    document.title = 'MONETIS | About';
  }, []);

  return (
    <>
      <HomeNavigation/>
      <div className='aboutContainer'>
        <div className='mainSection'>
          <h1>About <span>MONETIS</span></h1>
          <p>A dedicated space for QA engineers and automation enthusiasts <br />to experiment, validate testing tools, and refine their skills in a practical environment.</p>
        </div>

        <div className='featuresSection'>
          <div className='features'>
            <div className='feature'>
              <div>
                <IoInformationCircleOutline/>
                <h3>Purpose</h3>
              </div>
              <p>MONETIS is a purpose-built testing environment designed to help QA engineers and developers learn and practice automated testing techniques. This application simulates a real-world banking system while providing a safe, controlled environment for testing experiments.</p>
              <p>All data within the application is fictional and created specifically for testing purposes. This allows users to freely experiment with different testing approaches without the risk of affecting real financial data.</p>
            </div>

            <div className='feature'>
              <div>
                <IoCodeSlashOutline/>
                <h3>Testing Features</h3>
              </div>
              <ul>
                <li>API endpoints designed for various testing scenarios</li>
                <li>Predictable test data that resets periodically</li>
                <li>Common banking operations for end-to-end testing</li>
                <li>Edge cases and error scenarios for robust test coverage</li>
              </ul>
            </div>

            <div className='feature'>
              <div>
                <IoHappyOutline/>
                <h3>The Developer</h3>
              </div>
              <p>Hi! I&apos;m Alexandre Varela, a Software/QA engineer passionate about quality assurance and test automation. I created MONETIS to help fellow QA engineers and developers learn automated testing in a practical, hands-on way.</p>
              <p>This project is open source and welcomes contributions from the testing community. Whether you&apos;re just starting with test automation or you&apos;re an experienced QA engineer, MONETIS provides a platform to enhance your testing skills.</p>
              <p>Feel free to take a look at my <a href="https://eshkay.dev">Portfolio</a>! Thank you for your support, and happy testing!</p>
            </div>
          </div>
            
        </div>

        <footer>
          <div className='copyright'>
            <Image src={logoImage} alt="Register"></Image>
            <p>&copy; {curYear} MONETIS. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

