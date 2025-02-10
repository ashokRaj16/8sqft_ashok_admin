/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'via.placeholder.com', 
      'source.unsplash.com', 
      'api.8sqft.com',
      '8sqft-images.s3.eu-north-1.amazonaws.com', // Add this domain
      'images.unsplash.com',
      '8sqft-images-test.s3.eu-north-1.amazonaws.com',
      '8sqft-images.s3.amazonaws.com',
      
    ],
  },
  async rewrites() {
    return [
      { source: '/builder-post-property', destination: '/BuilderPostProperty' },
      { source: '/residential-plan', destination: '/ResidentialPlan' },
    ]
  }
};
