'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '../context/userContext';
import SelectRoiPage from '../../components/selectRegion';

const WelcomeRoiPage = () => {
  const [showRoiSelector, setShowRoiSelector] = useState<boolean>(true);
  const { interestRegions } = useUser();
  const router = useRouter();

  // Redirect to root if interestRegions is non-empty
  /*

  !interestRegions || (
  interestRegions.length == 1 && interestRegions[0].id === '1')
  )
  */
  useEffect(() => {
    if(interestRegions?.length > 0){
      if((interestRegions[0]?.id ?? "") !== '1'){
        router.push("/")
      }
    }
    }
  , [interestRegions, router]);

  return (
    <div className="min-h-screen bg-teal-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-6 text-center">
          Welcome! Connect with Issues That Matter to You
        </h1>
        
        <p className="text-emerald-800 text-lg mb-8 text-center">
          Discover and engage with local issues that impact your community. Select a region of interest to see relevant posts and make a difference where it counts. You can update this anytime in your profile.
        </p>

        {/* ROI Selector */}
        {showRoiSelector && (
          <div className="mb-8">
            <div className="border border-emerald-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <SelectRoiPage />
            </div>
          </div>
        )}

        {/* Skip Button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full font-medium transition-colors 
                       bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300
                       flex items-center justify-center gap-2 shadow-sm"
          >
            Explore Without Selecting a Region
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeRoiPage;