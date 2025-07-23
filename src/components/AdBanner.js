import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (window.adsbygoogle && adRef.current) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        // Ignore duplicate ad errors
      }
    }
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      margin: '1.5rem 0', padding: '0.5rem 0', background: '#f8fafc', borderRadius: 10, border: '1px solid #e5e7eb', minHeight: 60
    }}>
      <span style={{ fontSize: 12, color: '#64748b', marginRight: 8, fontWeight: 500, letterSpacing: 1 }}>Ad</span>
      <ins className="adsbygoogle"
        ref={adRef}
        style={{ display: 'block', width: '100%', minWidth: 200, minHeight: 50, maxWidth: 400, height: 60 }}
        data-ad-client="ca-pub-9078429429203432"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner; 