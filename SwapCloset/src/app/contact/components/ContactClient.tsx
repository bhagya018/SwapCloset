'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, MessageSquare, MapPin, Send, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactClient() {
  const form = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormData) => {
    // BACKEND INTEGRATION: POST /api/contact with data
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    form.reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@swapcloset.app',
      description: 'We typically respond within 24 hours',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      value: 'Available 9am - 6pm PST',
      description: 'Chat with our support team',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Portland, Oregon',
      description: 'Proudly made in the Pacific Northwest',
    },
  ];

  const faqs = [
    {
      question: 'How does swapping work?',
      answer: 'Simply list items you no longer wear, browse other listings, and send swap requests. Once both parties agree, arrange a meetup to exchange items.',
    },
    {
      question: 'Is SwapCloset free to use?',
      answer: 'Yes! SwapCloset is completely free. We believe sustainable fashion should be accessible to everyone.',
    },
    {
      question: 'How do you ensure safe swaps?',
      answer: 'We recommend meeting in public places during daylight hours. We also have a rating system and user verification to build trust within the community.',
    },
    {
      question: 'What if an item isn\'t as described?',
      answer: 'We encourage users to provide accurate descriptions and photos. If there\'s a significant discrepancy, you can decline the swap at the meetup and report the issue.',
    },
  ];

  return (
    <div className="fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-700 text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Contact Info */}
        <div className="space-y-6">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <div key={info.title} className="bg-card rounded-2xl border border-border p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-600 text-foreground mb-1">{info.title}</h3>
                <p className="text-sm font-500 text-foreground mb-1">{info.value}</p>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-8">
            <h2 className="text-xl font-700 text-foreground mb-6">Send us a message</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-500 text-foreground mb-1.5">Name</label>
                  <input
                    type="text"
                    className={`input-field ${form.formState.errors.name ? 'error' : ''}`}
                    placeholder="Your name"
                    {...form.register('name', { required: 'Name is required' })}
                  />
                  {form.formState.errors.name && (
                    <p className="mt-1.5 text-xs text-negative">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-500 text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    className={`input-field ${form.formState.errors.email ? 'error' : ''}`}
                    placeholder="your@email.com"
                    {...form.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email',
                      },
                    })}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1.5 text-xs text-negative">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-500 text-foreground mb-1.5">Subject</label>
                <select
                  className={`input-field ${form.formState.errors.subject ? 'error' : ''}`}
                  {...form.register('subject', { required: 'Subject is required' })}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
                {form.formState.errors.subject && (
                  <p className="mt-1.5 text-xs text-negative">{form.formState.errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-500 text-foreground mb-1.5">Message</label>
                <textarea
                  rows={5}
                  className={`input-field resize-none ${form.formState.errors.message ? 'error' : ''}`}
                  placeholder="How can we help you?"
                  {...form.register('message', { required: 'Message is required' })}
                />
                {form.formState.errors.message && (
                  <p className="mt-1.5 text-xs text-negative">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 rounded-xl text-sm font-600 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-700 text-foreground mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-600 text-foreground mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
