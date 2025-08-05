import React from 'react';
import { useCustomer } from '../hooks/useCustomer';
import { Package, ExternalLink, ShoppingCart, Smartphone, Wifi, Shield } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { currentCustomer } = useCustomer();

  if (!currentCustomer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No customer selected</p>
          <p className="text-sm text-gray-500">Search for a customer to view product details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Detail Page</h1>
          <p className="text-gray-600">O2 Smart Home products for {currentCustomer.name}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>O2 Smart Home eShop - Live</span>
        </div>
      </div>

      {/* Mock Product Store */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">O2 Smart Home Collection</h2>
            <p className="text-gray-600">Exclusive Google Nest products available through O2</p>
          </div>

          {/* Product Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Video Doorbells</h3>
              </div>
              <p className="text-sm text-gray-600">Flagship Nest Doorbell - Wired & Battery</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Security Cameras</h3>
              </div>
              <p className="text-sm text-gray-600">Nest Cam Indoor & Outdoor models</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Wifi className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-gray-900">Smart Speakers</h3>
              </div>
              <p className="text-sm text-gray-600">Google Nest Mini & Audio devices</p>
            </div>
          </div>

          {/* Featured Products */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for {currentCustomer.name}</h3>
          
          {/* Flagship Product - Google Nest Doorbell */}
          <div className="mb-6 border-2 border-purple-300 rounded-lg p-6 bg-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">FLAGSHIP</span>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">BEST SELLER</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Google Nest Doorbell (wired)</h4>
                <p className="text-gray-600 mt-1">See who's at your door from anywhere with 24/7 HDR video</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">£229.99</span>
                <p className="text-sm text-gray-500 line-through">£279.99</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center space-x-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <span className="font-medium">24/7 recording with Nest Aware (subscription)</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <span>HD video with HDR, night vision, and 3:4 aspect ratio</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <span>Person, package, vehicle, and animal detection</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <span>Talk and listen with two-way audio</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <span>Works with existing doorbell wiring</span>
              </li>
            </ul>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 font-semibold">
              <ShoppingCart className="w-5 h-5" />
              <span>Add Flagship Product to Cart</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Nest Doorbell Battery */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Google Nest Doorbell (battery)</h4>
                  <p className="text-sm text-gray-600 mt-1">Wire-free installation anywhere</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">£179.99</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Wire-free, runs on battery</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>3:4 aspect ratio shows full body view</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Smart alerts with AI detection</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
            
            {/* Google Nest Cam Indoor */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Google Nest Cam (indoor, wired)</h4>
                  <p className="text-sm text-gray-600 mt-1">24/7 live view, alerts, and more</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">£89.99</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>1080p HDR video with night vision</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Built-in intelligent alerts</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Works with Google Assistant</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Google Nest Mini */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Google Nest Mini (2nd gen)</h4>
                  <p className="text-sm text-gray-600 mt-1">Small and mighty smart speaker</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">£29.99</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>40% louder than original Mini</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Voice control for smart home</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Made from recycled materials</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Google Nest Cam Outdoor */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Google Nest Cam (outdoor, battery)</h4>
                  <p className="text-sm text-gray-600 mt-1">Wire-free outdoor security camera</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">£159.99</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Battery or wired power options</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>IP54 weather resistance</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Magnetic mount included</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Google Nest Hub */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Google Nest Hub (2nd gen)</h4>
                  <p className="text-sm text-gray-600 mt-1">Smart display with Google Assistant</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">£79.99</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>7" touchscreen display</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Sleep sensing technology</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Control smart home devices</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

          {/* Current Devices Notice */}
          {currentCustomer && currentCustomer.devices.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Customer already has {currentCustomer.devices.length} Google Nest device{currentCustomer.devices.length > 1 ? 's' : ''} registered.
                Consider upgrade options or complementary products.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};