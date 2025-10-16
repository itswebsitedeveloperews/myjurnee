// [9:30 PM, 4/25/2023] F. Mohil: Status 0 means - Past project
// [9:30 PM, 4/25/2023] F. Mohil: and status 1 means ongoing project

import {IMAGES} from '../Common/Constants/images';

export const dashboadData = [
  {
    id: 1,
    title: 'Carpenter',
    img: require('../assets/temp/tempCarpenter.png'),
  },
  {
    id: 2,
    title: 'Color',
    img: require('../assets/temp/tempCarpenter.png'),
  },
  {
    id: 3,
    title: 'Electrician',
    img: require('../assets/temp/tempCarpenter.png'),
  },
  {
    id: 4,
    title: 'Plumber',
    img: require('../assets/temp/tempCarpenter.png'),
  },
  {
    id: 5,
    title: 'Electrician',
    img: require('../assets/temp/tempCarpenter.png'),
  },
  {
    id: 6,
    title: 'Color',
    img: require('../assets/temp/tempCarpenter.png'),
  },
  {
    id: 7,
    title: 'Plumber',
    img: require('../assets/temp/tempCarpenter.png'),
  },
];

export const categoryData = [
  {
    id: 1,
    title: 'Wooden door',
    img: require('../assets/temp/wooden.png'),
  },
  {
    id: 2,
    title: 'Aluminum door',
    img: require('../assets/temp/wooden.png'),
  },
  {
    id: 3,
    title: 'Sintex door',
    img: require('../assets/temp/wooden.png'),
  },
  {
    id: 4,
    title: 'Wooden door',
    img: require('../assets/temp/wooden.png'),
  },
  {
    id: 5,
    title: 'Aluminum door',
    img: require('../assets/temp/wooden.png'),
  },
  {
    id: 6,
    title: 'Sintex door',
    img: require('../assets/temp/wooden.png'),
  },
];

export const agencies = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
];

export const agenciesList = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
  {
    id: 9,
  },
];

export const projectsData = [
  {
    client_name: 'Client One',
    created_at: '2023-04-22T04:32:44.000000Z',
    id: 9,
    location: 'Bapunagar',
    project_image1: 'photo1.jpg',
    project_image2: 'photo2.jpg',
    project_image3: null,
    project_image4: null,
    project_name: 'Project One',
    project_status: '1',
    updated_at: '2023-04-22T04:32:44.000000Z',
  },
  {
    client_name: 'Mila',
    created_at: '2023-04-23T06:41:55.000000Z',
    id: 10,
    location: 'Gandhinagar',
    project_image1: 'IMG-20230415-WA0003.jpg',
    project_image2: 'IMG-20230415-WA0002.jpg',
    project_image3: null,
    project_image4: null,
    project_name: 'Milan',
    project_status: '1',
    updated_at: '2023-04-23T06:41:55.000000Z',
  },
  {
    client_name: 'Milan',
    created_at: '2023-04-23T06:55:45.000000Z',
    id: 11,
    location: 'Gandhinagar',
    project_image1: 'IMG-20230404-WA0011.jpg',
    project_image2: null,
    project_image3: null,
    project_image4: null,
    project_name: 'Test 2',
    project_status: '1',
    updated_at: '2023-04-23T06:55:45.000000Z',
  },
];

export const plansData = [
  {
    // id: 1,
    bgImg: IMAGES.PAYMENT_1,
    diamondImg: IMAGES.DIAMOND_1,
    // name: 'Gold',
    // price: 'Rs. 15000',
    detailsArr: [
      {
        id: 1,
        title: 'All free inquires',
      },
      {
        id: 2,
        title: 'Unlimited access',
      },
      {
        id: 3,
        title: 'Best ranking to your agency',
      },
      {
        id: 4,
        title: 'Premium features access',
      },
    ],
  },
  {
    // id: 2,
    bgImg: IMAGES.PAYMENT_2,
    diamondImg: IMAGES.DIAMOND_2,
    // name: 'Silver',
    // price: 'Rs. 10000',
    detailsArr: [
      {
        id: 1,
        title: 'All free inquires',
      },
      {
        id: 2,
        title: 'Unlimited access',
      },
      {
        id: 3,
        title: 'Best ranking to your agency',
      },
    ],
  },
  {
    // id: 3,
    bgImg: IMAGES.PAYMENT_3,
    diamondImg: IMAGES.DIAMOND_3,
    // name: 'Silver',
    // price: 'Rs. 10000',
    detailsArr: [
      {
        id: 1,
        title: 'All free inquires',
      },
      {
        id: 2,
        title: 'Unlimited access',
      },
      {
        id: 3,
        title: 'Best ranking to your agency',
      },
    ],
  },
];
