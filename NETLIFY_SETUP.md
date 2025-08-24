# Netlify Forms Setup for Vending Machine Submissions

This guide will help you set up Netlify Forms to handle the vending machine submission form with image uploads.

## 🚀 **What We've Built**

- ✅ **Floating Action Button**: Shows full text initially, minimizes to icon when scrolling
- ✅ **Submission Modal**: Clean form with building name, floor level, description, and photo uploads
- ✅ **Netlify Forms Integration**: Handles both text data and image uploads
- ✅ **No Backend Required**: Everything works through Netlify's built-in form handling

## 📋 **How It Works**

1. **User clicks the floating action button** (bottom-right corner)
2. **Modal opens** with the submission form
3. **User fills out the form** and uploads photos
4. **Form submits to Netlify** automatically
5. **You receive an email** with all the form data and image attachments

## 🔧 **Setup Steps**

### **Step 1: Deploy to Netlify**

1. **Push your code to GitHub** (if you haven't already)
2. **Go to [Netlify](https://netlify.com)** and sign up/login
3. **Click "New site from Git"**
4. **Connect your GitHub repository**
5. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
6. **Click "Deploy site"**

### **Step 2: Configure Form Notifications**

1. **In your Netlify dashboard**, go to **Forms**
2. **Find your form**: `vending-machine-submission`
3. **Click on the form** to see submissions
4. **Go to Settings** → **Form notifications**
5. **Add notification**:
   - **Type**: Email notification
   - **Email**: Your email address
   - **Subject**: `New Vending Machine Submission - {buildingName}`
   - **Email template**: Customize as needed

### **Step 3: Test the Form**

1. **Visit your deployed site**
2. **Click the floating action button**
3. **Fill out the form** and upload a test image
4. **Submit the form**
5. **Check your email** for the submission
6. **Check Netlify Forms** to see the submission data

## 📧 **What You'll Receive**

Each submission email will contain:
- **Building Name**: e.g., "Perkins Library"
- **Floor Level**: e.g., "2nd Floor"
- **Description**: User's description of what they found
- **Images**: Attached photos (if any)

## 🎯 **Form Features**

- **Required Fields**: Building name, floor level, description
- **Image Uploads**: Multiple images supported (JPEG, PNG, WebP)
- **File Size Limit**: 5MB per image
- **Spam Protection**: Honeypot field to prevent bots
- **Mobile Friendly**: Responsive design for all devices

## 🔒 **Security & Spam Protection**

- **Honeypot Field**: Hidden field to catch bots
- **File Type Validation**: Only images allowed
- **Size Limits**: Prevents large file uploads
- **Rate Limiting**: Netlify handles this automatically

## 📱 **Mobile Experience**

- **Touch-Friendly**: Large buttons and inputs
- **Responsive Design**: Adapts to all screen sizes
- **File Upload**: Native file picker on mobile
- **Smooth Animations**: Professional feel on all devices

## 🚨 **Troubleshooting**

### **Form Not Working?**
1. Check that you're deployed to Netlify
2. Verify the hidden form is in your HTML
3. Check browser console for errors
4. Ensure form name matches exactly

### **Images Not Attaching?**
1. Check file size limits
2. Verify file types (JPEG, PNG, WebP)
3. Check Netlify form settings
4. Look for upload errors in console

### **No Email Notifications?**
1. Check Netlify form notification settings
2. Verify your email address
3. Check spam folder
4. Test with a simple submission first

## 🎉 **You're All Set!**

Once deployed to Netlify:
- Users can submit reports with photos
- You'll get email notifications
- All data is stored securely
- No backend maintenance required
- Scales automatically with usage

## 📊 **Monitoring Submissions**

- **Netlify Dashboard** → Forms → View all submissions
- **Email Notifications** for each submission
- **Form Analytics** (submission counts, success rates)
- **Export Data** if needed for analysis

The form is now completely self-contained and will work perfectly once deployed to Netlify!
