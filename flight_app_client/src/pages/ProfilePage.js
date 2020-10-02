import React from 'react';
import NavBar from '../components/NavBar';

export default function ProfilePage() {
  return (
    <div>
      <NavBar />
      <div style={{ marginTop: '80px' }}>
        <ul>
          <h3>Welcome to your stash!</h3>
          <h4>Here's whats changed since you last looked</h4>
          <li>
            <div>Flight Card</div>
            <div>Flight Increased: $10 since last check</div>
          </li>
          <li>
            <div>Flight Card</div>
            <div>Flight Decreased: $90 since last check</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
