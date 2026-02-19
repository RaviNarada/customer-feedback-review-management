# Customer Feedback & Review Management System

A role-based web application that enables structured collection and analysis of feedback.  
Trainees can submit course-wise reviews for trainers, and administrators can monitor sentiment, respond to feedback, and generate performance reports.

---

## Training Domain Mapping

| Generic System        | This Project Implementation |
|-----------------------|----------------------------|
Customer                | Trainee                    |
Product / Service       | Course                     |
Service Provider        | Trainer                    |
Review & Rating         | Trainee Feedback           |
Admin                   | Admin                      |
Business Reports        | Trainer Performance Reports|

---

## Tech Stack

Frontend:
- React.js
- shadcn/ui

Backend:
- Node.js
- Express.js
- Prisma ORM

Database:
- MySQL

Authentication:
- JWT
- bcrypt

---

## Core Features

- Role-based authentication (Admin, Trainee)
- Trainer and course management
- Course-wise feedback submission
- Admin response to feedback
- Sentiment-based analytics
- Performance reports

---

## Student Review Module

This module allows trainees to:

- View trainers
- View courses handled by a trainer
- Submit feedback with:
  - Rating
  - Review
  - Sentiment (Very Poor → Very Good)
- View their submitted feedback

---

## Repository Setup

### Clone the repository

```bash
git clone https://github.com/RaviNarada/customer-feedback-review-management.git
