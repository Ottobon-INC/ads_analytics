import { useState, useEffect, useRef } from 'react';
import { CONTACT_SLOTS } from '../config/sheets';

const LIVE_PROSPECTS = [
  { name: 'Arjun Sen', city: 'Mumbai', slot: 'Morning', attempts: 1 },
  { name: 'Pooja Hegde', city: 'Hyderabad', slot: 'Afternoon', attempts: 1 },
  { name: 'Rohan Deshpande', city: 'Bangalore', slot: 'Evening', attempts: 2 },
  { name: 'Meera Nambiar', city: 'Chennai', slot: 'Morning', attempts: 1 },
  { name: 'Vikram Joshi', city: 'Pune', slot: 'Afternoon', attempts: 1 }
];

export function useLiveSimulation(onNewLeadReceived) {
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [liveToast, setLiveToast] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isLiveStreaming) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const template = LIVE_PROSPECTS[Math.floor(Math.random() * LIVE_PROSPECTS.length)];
      const randomPhone = `98${Math.floor(Math.random() * 90000000 + 10000000)}`;

      const newLead = {
        id: `live-lead-${Date.now()}`,
        name: template.name,
        phone: randomPhone,
        city: template.city,
        contactTime: template.slot,
        time: template.slot === 'Morning' ? '11:00 AM' : (template.slot === 'Afternoon' ? '03:30 PM' : '06:00 PM'),
        attempts: template.attempts,
        campaign: 'Meta Ads - Live Real-Time Stream',
        date: new Date().toLocaleDateString(),
        status: 'New',
        notes: `Live lead submission: Preferred slot ${template.slot} in ${template.city}.`,
        spend: 0
      };

      if (onNewLeadReceived) {
        onNewLeadReceived(newLead);
      }

      setLiveToast({
        title: `🔥 New Inbound Lead Captured!`,
        message: `${template.name} from ${template.city} just submitted the ad form (Prefers ${template.slot})!`,
        time: new Date().toLocaleTimeString()
      });

      setTimeout(() => {
        setLiveToast(null);
      }, 5000);

    }, 9000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLiveStreaming, onNewLeadReceived]);

  return {
    isLiveStreaming,
    setIsLiveStreaming,
    liveToast,
    dismissLiveToast: () => setLiveToast(null)
  };
}
