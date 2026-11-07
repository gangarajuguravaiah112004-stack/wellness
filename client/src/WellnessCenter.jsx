import { useEffect, useState } from 'react';
import { Activity, ArrowDown, ArrowRight, CalendarDays, Check, Clock3, Flower2, HeartPulse, Instagram, Leaf, Mail, Menu, Phone, Scale, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react';

const programs = [
  { title: 'Weight Loss', icon: Scale, number: '01', color: 'lime', description: 'Build a steady routine with practical nutrition guidance shaped around your everyday life.' },
  { title: 'Weight Gain', icon: TrendingUp, number: '02', color: 'coral', description: 'Support your goals with a consistent nutrition and meal-planning routine.' },
  { title: 'Digestion Health', icon: Activity, number: '03', color: 'blue', description: 'Explore everyday nutrition and routine choices to support digestive wellbeing.' },
  { title: "Women's Health", icon: Flower2, number: '04', color: 'yellow', description: "Personalized support for women's nutrition and everyday wellness goals." },
];

function WellnessCenter() {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function chooseProgram(program) {
    setSelectedProgram(program);
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  async function submitConsultation(event) {
    event.preventDefault();
    setSubmitting(true);
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'We could not send your request. Please try again.');
      formElement.reset();
      setSelectedProgram('');
      setNotice('Your free assessment request is in. Hansika or Sathish will contact you to confirm a time.');
    } catch (error) {
      setNotice(error.message || 'The server is unavailable. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="center-app">
      <div className="center-announcement"><Sparkles size={14} /><span>FREE WELLNESS ASSESSMENT</span><span className="announcement-divider">/</span><span>PERSONAL GUIDANCE, ONE STEP AT A TIME</span></div>
      <header className="center-header">
        <a className="center-brand" href="#home" aria-label="Hansika Sathish Wellness Center home">
          <span className="center-brand-icon"><Leaf size={21} /></span>
          <span className="center-brand-name">HANSIKA SATHISH<small>WELLNESS CENTER</small></span>
        </a>
        <button className="center-menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'center-nav is-open' : 'center-nav'} aria-label="Main navigation">
          <a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <a className="center-header-cta" href="#book">Book a free assessment <ArrowRight size={15} /></a>
      </header>

      <main>
        <section className="center-hero" id="home">
          <div className="center-hero-photo" role="img" aria-label="Fresh ingredients for a balanced meal" />
          <div className="center-hero-shade" />
          <div className="center-hero-content">
            <div className="center-eyebrow light"><span /> A MORE PERSONAL WELLNESS ROUTINE</div>
            <h1>Hansika Sathish<br /><em>Wellness Center</em></h1>
            <p className="center-tagline">Better Your Health With Change One Meal in Replace of Good Nutrition</p>
            <p className="center-hero-copy">A friendly place to begin building everyday nutrition habits, one small step at a time.</p>
            <a className="center-primary-button" href="#book">Book your free assessment <ArrowRight size={17} /></a>
            <a className="center-hero-phone" href="tel:+919642604521"><Phone size={15} /> Speak with Sathish <span>+91 96426 04521</span></a>
          </div>
          <div className="center-hero-index"><span>01</span><i /><span>YOUR NEXT STEP STARTS HERE</span></div>
          <a className="center-scroll-cue" href="#programs"><ArrowDown size={15} /> EXPLORE THE FOUR PILLARS</a>
          <div className="center-hero-sticker"><Leaf size={16} /><span>SMALL STEPS.<br />STEADY SUPPORT.</span></div>
        </section>

        <section className="center-motto" id="approach">
          <div className="center-motto-mark"><span>“</span></div>
          <div className="center-motto-copy"><div className="center-eyebrow"><span /> OUR MOTTO</div><p>Change your weight with changing on one meal. Small consistent steps create extraordinary health results.</p></div>
          <div className="center-motto-side"><span className="motto-line" /><span>YOUR WELLNESS JOURNEY<br />IS PERSONAL</span></div>
        </section>

        <section className="center-programs" id="programs">
          <div className="center-section-heading">
            <div><div className="center-eyebrow"><span /> FOUR PILLARS OF BETTER HEALTH</div><h2>Find your focus.<br /><em>Start with one.</em></h2></div>
            <p>Every journey is different. Choose the area you would like support with and we can talk through a routine that suits you.</p>
          </div>
          <div className="center-program-grid">
            {programs.map(({ title, icon: Icon, number, color, description }) => (
              <article className={`center-program-card ${color}`} key={title}>
                <div className="program-card-top"><span className="program-number">PILLAR {number}</span><span className="program-icon"><Icon size={22} strokeWidth={1.7} /></span></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <button className="program-link" onClick={() => chooseProgram(title)}>Explore this program <ArrowRight size={15} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="center-approach-band">
          <div className="center-approach-image" role="img" aria-label="A nourishing meal prepared with fresh ingredients" />
          <div className="center-approach-copy">
            <div className="center-eyebrow"><span /> CORE APPROACH</div>
            <h2>Meal replacement<br />for <em>better vitality.</em></h2>
            <p>Explore a meal-replacement routine as part of a broader, balanced approach to everyday nutrition. Your consultation is a chance to share your goals and ask questions before you decide what feels right.</p>
            <div className="approach-points"><span><Check size={15} /> One-to-one conversation</span><span><Check size={15} /> Guidance shaped around your goals</span><span><Check size={15} /> Small, consistent next steps</span></div>
            <button className="center-text-link" onClick={() => chooseProgram('')}>Talk through your goals <ArrowRight size={16} /></button>
          </div>
          <div className="center-approach-label"><HeartPulse size={15} /> WELLNESS, AT YOUR PACE</div>
        </section>

        <section className="center-booking" id="book">
          <div className="booking-intro">
            <div className="center-eyebrow"><span /> COMPLIMENTARY FIRST STEP</div>
            <h2>Let's talk about<br /><em>what matters to you.</em></h2>
            <p>Book a free assessment with Hansika or Sathish. Share a little about your goals and we will get back to you to arrange a time.</p>
            <div className="booking-perks"><span><CalendarDays size={17} /> Free assessment</span><span><Clock3 size={17} /> No obligation</span></div>
            <div className="booking-contact-note"><ShieldCheck size={17} /><span>Your details are only used to respond to your consultation request.</span></div>
          </div>
          <form className="center-booking-form" onSubmit={submitConsultation}>
            <div className="booking-form-heading"><span>01 / YOUR DETAILS</span><span>* REQUIRED</span></div>
            <label>Your name *<input name="name" autoComplete="name" placeholder="How should we address you?" required maxLength="100" /></label>
            <div className="booking-form-row">
              <label>Phone number *<input name="phone" type="tel" autoComplete="tel" placeholder="+91 00000 00000" required maxLength="24" /></label>
              <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength="160" /></label>
            </div>
            <label>What would you like support with? *<select name="program" value={selectedProgram} onChange={(event) => setSelectedProgram(event.target.value)} required><option value="" disabled>Select a health program</option>{programs.map((program) => <option key={program.title} value={program.title}>{program.title}</option>)}</select></label>
            <label>Preferred date and time <span className="optional-label">OPTIONAL</span><input name="preferredTime" type="datetime-local" /></label>
            <label>A note for us <span className="optional-label">OPTIONAL</span><textarea name="notes" rows="3" maxLength="500" placeholder="What would you like us to know? Please don't include private medical details." /></label>
            <button className="center-submit-button" type="submit" disabled={submitting}>{submitting ? 'Sending your request…' : 'Request my free assessment'} {!submitting && <ArrowRight size={17} />}</button>
            <p className="form-disclaimer">Request only. Hansika or Sathish will contact you to confirm an appointment time.</p>
          </form>
        </section>

        <section className="center-contact" id="contact">
          <div className="contact-heading"><div className="center-eyebrow light"><span /> HERE TO HELP YOU BEGIN</div><h2>A real person.<br /><em>A simple next step.</em></h2><p>Questions before booking? Reach out directly and we will be glad to hear from you.</p></div>
          <div className="contact-list">
            <a className="contact-item" href="tel:+919642604521"><span className="contact-icon"><Phone size={18} /></span><span><small>SATHISH</small><strong>+91 96426 04521</strong></span><ArrowRight size={16} /></a>
            <a className="contact-item" href="tel:+919100882267"><span className="contact-icon"><Phone size={18} /></span><span><small>HANSIKA</small><strong>+91 91008 82267</strong></span><ArrowRight size={16} /></a>
            <a className="contact-item" href="mailto:kmunihansika716@gmail.com"><span className="contact-icon"><Mail size={18} /></span><span><small>EMAIL</small><strong>kmunihansika716@gmail.com</strong></span><ArrowRight size={16} /></a>
            <a className="contact-item" href="https://instagram.com/HS_Wellness_Center" target="_blank" rel="noreferrer"><span className="contact-icon"><Instagram size={18} /></span><span><small>INSTAGRAM</small><strong>@HS_Wellness_Center</strong></span><ArrowRight size={16} /></a>
          </div>
        </section>
      </main>

      <footer className="center-footer">
        <a className="center-brand footer-center-brand" href="#home"><span className="center-brand-icon"><Leaf size={20} /></span><span className="center-brand-name">HANSIKA SATHISH<small>WELLNESS CENTER</small></span></a>
        <p>Better Your Health With Change One Meal in Replace of Good Nutrition</p>
        <div className="center-footer-links"><a href="#programs">Programs</a><a href="#approach">Our approach</a><a href="#book">Free assessment</a><a href="#contact">Contact</a></div>
        <small className="center-disclaimer">Wellness guidance is not medical care. Consult a qualified health professional for diagnosis or treatment. Individual experiences vary.</small>
        <span className="center-copyright">© 2026 Hansika Sathish Wellness Center</span>
      </footer>

      {notice && <div className="center-toast" role="status"><Check size={17} /><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice('')}><X size={15} /></button></div>}
    </div>
  );
}

export default WellnessCenter;
