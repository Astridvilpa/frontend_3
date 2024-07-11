import React from 'react';
import UserProfile from '../user_profile/UserProfile';

export default function Admin() {
  return <UserProfile isAdmin={true} />;
}