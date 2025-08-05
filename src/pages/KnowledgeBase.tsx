import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, Clock, Tag, ChevronRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  lastUpdated: string;
  tags: string[];
  url: string;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Google Nest Doorbell Setup & Configuration Guide',
    category: 'Devices',
    summary: 'Complete installation guide for Google Nest Doorbell (wired & battery) - our flagship security device.',
    lastUpdated: '2025-01-10',
    tags: ['doorbell', 'flagship', 'setup', 'security'],
    url: '#'
  },
  {
    id: '2',
    title: 'Troubleshooting Google Nest Doorbell Connection Issues',
    category: 'Devices',
    summary: 'Common issues and solutions for Nest Doorbell connectivity, chime, and notification problems.',
    lastUpdated: '2025-01-09',
    tags: ['doorbell', 'troubleshooting', 'connectivity'],
    url: '#'
  },
  {
    id: '3',
    title: 'Google Nest Cam Indoor/Outdoor Setup',
    category: 'Devices',
    summary: 'Installation guide for Google Nest security cameras to complement your doorbell system.',
    lastUpdated: '2025-01-08',
    tags: ['camera', 'security', 'setup'],
    url: '#'
  },
  {
    id: '4',
    title: 'Google Nest Mini & Smart Home Integration',
    category: 'Devices',
    summary: 'Connect and control your Nest Doorbell and cameras with voice commands using Nest Mini.',
    lastUpdated: '2025-01-07',
    tags: ['nest-mini', 'integration', 'voice-control'],
    url: '#'
  },
  {
    id: '5',
    title: 'Nest Doorbell Advanced Features & AI Detection',
    category: 'Features',
    summary: 'Maximize your Nest Doorbell with person detection, package alerts, and familiar face recognition.',
    lastUpdated: '2025-01-06',
    tags: ['doorbell', 'ai', 'features', 'security'],
    url: '#'
  },
  {
    id: '6',
    title: 'Subscription Plans for Nest Aware',
    category: 'Billing',
    summary: 'Compare Nest Aware plans for enhanced doorbell features, video history, and 24/7 recording.',
    lastUpdated: '2025-01-05',
    tags: ['subscription', 'nest-aware', 'billing'],
    url: '#'
  },
  {
    id: '7',
    title: 'Wi-Fi Requirements for Google Nest Devices',
    category: 'Connectivity',
    summary: 'Network requirements and optimization tips for Google Nest Doorbell and smart home devices.',
    lastUpdated: '2025-01-04',
    tags: ['wifi', 'connectivity', 'requirements'],
    url: '#'
  },
  {
    id: '8',
    title: 'Device Offline Troubleshooting',
    category: 'Connectivity',
    summary: 'How to diagnose and fix Google Nest devices that appear offline in the system.',
    lastUpdated: '2025-01-02',
    tags: ['devices', 'offline', 'troubleshooting'],
    url: '#'
  },
  {
    id: '9',
    title: 'Customer Data Protection Guidelines',
    category: 'Compliance',
    summary: 'Important guidelines for handling customer data and DPA compliance for smart home devices.',
    lastUpdated: '2024-12-28',
    tags: ['dpa', 'compliance', 'data-protection'],
    url: '#'
  }
];

const categories = ['All', 'Devices', 'Features', 'Connectivity', 'Billing', 'Compliance'];

export const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-gray-600">Find answers and guidance for customer support</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search articles, guides, and documentation..."
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredArticles.map(article => (
          <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">{article.category}</span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{article.summary}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Updated {article.lastUpdated}</span>
              </div>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <span>Read More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No articles found matching your search criteria.</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms or category filter.</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Agent Training</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Policy Updates</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">FAQ Database</span>
          </a>
        </div>
      </div>
    </div>
  );
};