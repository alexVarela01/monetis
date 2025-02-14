'use client';

import { useEffect } from 'react';
import "./page.css";
import HomeNavigation from '../Components/HomeNavigation/HomeNavigation';
import logoImage from '@/public/Logo_white.png';
import Image from 'next/image';
import { LuRefreshCw, LuTestTubeDiagonal, LuWebhook } from 'react-icons/lu';
import { BiBook, BiShield } from 'react-icons/bi';


export default function About() {
  const curYear = new Date().getFullYear();

  useEffect(() => {
    document.title = 'MONETIS | About';
  }, []);

  return (
    <>
      <HomeNavigation/>
      <div className='docContainer'>
        <div className='mainSection'>
          <LuTestTubeDiagonal/>
          <h1>Testing Documentation</h1>
          <p>Complete guide for automated testing with MONETIS</p>
        </div>

        <div className='infoSection'>
          <div className='infoContainer'>

            <div className="subTitle">
              <LuWebhook/>
              <h2>Testing Endpoints</h2>
            </div>

            <div className='info'>
              <div>
                <h3>Balance management</h3>
              </div>

              <div className="endpoint">
                <span className='post'>POST</span><code>/api/users/api/addMoney</code>
              </div>
              <p>Add money directly into the checking account</p>
              
              <h5>Headers (Account to add money)</h5>
              <pre>
{`x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>

              <h5>Request body</h5>
              <pre>
{`{
    "amount": "10000",
}`}
              </pre>

              <hr />

              <div>
                <h3>Account management</h3>
              </div>

              <div className="endpoint">
                <span className='post'>POST</span><code>/api/users/register</code>
              </div>
              <p>Create a testing account</p>
              
              <h5>Request body</h5>
              <pre>
{`{
    "name": "Testing",
    "surname": "Account",
    "email": "testingaccount@eshkay.dev",
    "phone_number": "123123123", 
    "street_address": "Some Random street", 
    "postal_code": "1231-123", 
    "city": "Lisbon", 
    "country": "PT", 
    "password": "thisIsMyPassword!1", 
    "confirmPassword": "thisIsMyPassword!1"
}`}
              </pre>

              <div className="endpoint"style={{ marginTop: '10px' }}>
                <span className='delete'>DELETE</span><code>/api/users/api/deleteAccount</code>
              </div>
              <p>Delete a testing account and all related data (history, account, user)</p>
              <h5>Headers (Account to be deleted)</h5>
              <pre>
{`x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>
              <hr />

               <div>
                <h3>Transactions</h3>
              </div>

              <div className="endpoint">
                <span className='get'>GET</span><code>/api/users/api/getIbanByEmail?email={"{email}"}</code>
              </div>
              <p>Retrieves the IBANs of all accounts associated with the target user using their email</p>
              
              <h5>Headers (Your account to access endpoint)</h5>
              <pre>
{`x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>
            </div>

            <div className="subTitle">
              <LuRefreshCw/>
              <h2>Data Cleanup</h2>
            </div>

            <div className='info'>
              <div>
                <h3>Automated Cleanup Process</h3>
              </div>

              <p>Currently, the system automatically cleans up all test data every 7 days</p>
              
              <div className='warning'>
                <BiShield/>
                <span>Important: Always use the delete endpoints after test execution to maintain a clean test environment.</span>
              </div>
              
              <div>
                <h3>Manual Delete Endpoint</h3>
              </div>

              <pre>
{`DELETE /api/users/api/deleteAccount

// Headers
// username and password from account you want to delete
x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>
            </div>

            <div className="subTitle">
              <BiBook/>
              <h2>Best Practices</h2>
            </div>

            <div className='info'>
            <div>
                <h3>Test User Management</h3>
              </div>

              <ul>
                <li>Create a new test user for each test execution</li>
                <li>Use meaningful prefixes for test emails (e.g., &quot;test_automation_&quot;)</li>
                <li>Delete test users after test execution completes</li>
              </ul>

              <div style={{ marginTop: '10px' }}>
                <h3>Data Isolation</h3>
              </div>

              <ul>
                <li>Use unique identifiers for test data to prevent conflicts</li>
                <li>Create dedicated test accounts for very specific test scenarios</li>
                <li>Clean up test data immediately after test execution</li>
              </ul>

              <div style={{ marginTop: '10px' }}>
                <h3>Test Execution & Stability</h3>
              </div>

              <ul>
                <li>Use explicit waits instead of arbitrary sleep timers to handle dynamic elements</li>
                <li>Run tests in parallel to speed up execution time</li>
                <li>Implement retry mechanisms for flaky tests instead of allowing false failures</li>
              </ul>
              
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

