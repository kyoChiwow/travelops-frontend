export interface IBooking {
  paymentUrl: string
  booking: Booking
}

export interface Booking {
  _id: string
  user: User
  tour: Tour
  status: string
  guestCount: number
  createdAt: string
  updatedAt: string
  __v: number
  payment: Payment
}

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  address: string
}

export interface Tour {
  _id: string
  title: string
  costFrom: number
}

export interface ICreateBooking {
  tour: string;
  guestCount: number;
};

export interface Payment {
  _id: string
  booking: string
  transactionId: string
  status: string
  amount: number
  createdAt: string
  updatedAt: string
  __v: number
}