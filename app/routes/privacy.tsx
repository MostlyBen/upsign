const Privacy = () => {
  return (
    <div className="prose px-16 py-8">

      <h1>Privacy Policy</h1>

      <p>Last updated: 9/18/2024</p>

      <h2>1. Information We Collect</h2>
      <p>We collect the following information when you use our website:</p>
      <ul>
        <li>Your email address</li>
        <li>Your name</li>
      </ul>
      <p>This information is obtained through Google Sign-In and stored in our Google Firestore database.</p>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information solely for the purpose of:</p>
      <ul>
        <li>Authenticating your account</li>
        <li>Personalizing your experience on our website</li>
        <li>Communicating with you about your account or our services</li>
      </ul>

      <h2>3. Data Storage and Security</h2>
      <p>Your information is securely stored in Google Firestore. We implement appropriate technical and organizational measures to protect your data.</p>

      <h2>4. Third-Party Services</h2>
      <p>We use Google Sign-In for authentication. Please refer to Google&apos;s Privacy Policy for information on how they handle your data.</p>

      <h2>5. Data Sharing</h2>
      <p>We do not share, sell, rent, or trade your personal information with any third parties.</p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Request correction of your data</li>
        <li>Request deletion of your account and associated data</li>
      </ul>

      <h2>7. Changes to This Policy</h2>
      <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

      <h2>8. Contact Us</h2>
      <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:ben@upsign.app">ben@upsign.app</a></p>
    </div>
  )
}

export default Privacy;

