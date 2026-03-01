import React from 'react';
import { EnvelopeIcon, ChatBubbleLeftRightIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-slate-900 font-sans antialiased pt-20 pb-20">
      <main className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Left Side: Header */}
          <div className="lg:col-span-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-6 italic">Support Center</h3>
            <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none mb-8">
              Stay in <br /><span className="text-slate-300">Touch.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-tight mb-12">
              มีคำถามเกี่ยวกับสินค้า หรือต้องการสอบถามสถานะพัสดุ? <br />
              ทีมงานของเราพร้อมช่วยเหลือคุณเสมอ
            </p>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 group hover:border-black transition-all">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Official</p>
                  <p className="text-lg font-black italic uppercase">@ARTTOY_VAULT</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 group hover:border-black transition-all">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Support</p>
                  <p className="text-lg font-black italic uppercase">support@vault-store.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Simple Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-4">Full Name</label>
                    <input type="text" placeholder="YOUR NAME" className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-black transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-4">Email Address</label>
                    <input type="email" placeholder="EMAIL@EXAMPLE.COM" className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-black transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-4">Message</label>
                  <textarea rows="4" placeholder="HOW CAN WE HELP YOU?" className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-black transition-all"></textarea>
                </div>

                <button className="w-full bg-black text-white p-8 rounded-[2rem] font-black uppercase italic tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10">
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Contact;