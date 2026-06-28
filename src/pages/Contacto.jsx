import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { sileo } from 'sileo';
import Footer from '../components/layout/Footer';
import '../styles/pages/Contacto.css';

const Contacto = () => {
    const form = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Animación del Título (Desaparece al hacer scroll normal) ──
    const { scrollY } = useScroll();
    const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const titleY = useTransform(scrollY, [0, 300], [0, -100]);

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            form.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
            .then(() => {
                sileo.success({
                    title: "¡Mensaje Enviado!",
                    description: "Me pondré en contacto contigo pronto.",
                    position: "bottom-right"
                });
                form.current.reset();
            }, (error) => {
                console.error(error);
                sileo.error({
                    title: "Error",
                    description: "Hubo un problema al enviar el mensaje.",
                    position: "bottom-right"
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const socialCards = [
        {
            name: "GitHub",
            icon: <FaGithub size={40} className="social-icon-github" />,
            href: "https://github.com/LautaroLeall",
            colorClass: "social-card-github"
        },
        {
            name: "LinkedIn",
            icon: <FaLinkedin size={40} className="social-icon-linkedin" />,
            href: "https://www.linkedin.com/in/lauldp/",
            colorClass: "social-card-linkedin"
        },
        {
            name: "WhatsApp",
            icon: <FaWhatsapp size={40} className="social-icon-whatsapp" />,
            href: "https://api.whatsapp.com/send/?phone=543813399463&text&type=phone_number&app_absent=0",
            colorClass: "social-card-whatsapp"
        },
        {
            name: "lautaroleal4@gmail.com",
            icon: <Mail size={40} className="social-icon-email" />,
            href: null,
            colorClass: "social-card-email",
            isEmail: true
        }
    ];

    return (
        <div className="contacto-page">
            {/* Fondo Decorativo Estático */}
            <div className="contacto-bg-decor">
                <div className="contacto-bg-shape-1" />
                <div className="contacto-bg-shape-2" />
            </div>

            <div className="contacto-main-container">
                {/* ── HEADER DE SECCIÓN (Desaparece con el scroll) ── */}
                <motion.div
                    style={{ y: titleY, opacity: titleOpacity }}
                    className="contacto-header"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="contacto-title"
                    >
                        Ponte en <span className="nova-gradient-text">Contacto</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="contacto-subtitle"
                    >
                        ¿Tienes un proyecto en mente o consultas sobre Nova SetUp? Escríbeme.
                    </motion.p>
                </motion.div>

                {/* ── CONTENIDO PRINCIPAL (Form + Redes) ── */}
                <div className="contacto-content-wrapper">
                    <div className="contacto-content-inner">

                        {/* Formulario */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6 }}
                            className="contacto-form-card"
                        >
                            <div className="contacto-form-header">
                                <h2 className="contacto-form-title">Hablemos</h2>
                                <p className="contacto-form-desc">Envíame un mensaje directo a mi correo.</p>
                            </div>

                            <form ref={form} onSubmit={sendEmail} className="contacto-form">
                                <div className="contacto-form-group">
                                    <label className="contacto-form-label">Nombre</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        required
                                        className="contacto-form-input"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                <div className="contacto-form-group">
                                    <label className="contacto-form-label">Email</label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        required
                                        className="contacto-form-input"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div className="contacto-form-group">
                                    <label className="contacto-form-label">Mensaje</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="4"
                                        className="contacto-form-input contacto-form-textarea"
                                        placeholder="¿En qué te puedo ayudar?"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="contacto-submit-btn"
                                >
                                    {isSubmitting ? (
                                        <span className="contacto-submit-text-pulse">Enviando...</span>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Enviar Mensaje</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Redes Sociales - Aparecen una por una */}
                        <div className="contacto-social-wrapper">
                            {socialCards.map((card, index) => (
                                <motion.div
                                    key={card.name}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.15) }} // Retraso escalonado
                                    className="contacto-social-item"
                                >
                                    {card.isEmail ? (
                                        <div className={`contacto-social-card ${card.colorClass}`}>
                                            {card.icon}
                                            <span className="contacto-social-card-name-email">{card.name}</span>
                                        </div>
                                    ) : (
                                        <a
                                            href={card.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`contacto-social-card ${card.colorClass}`}
                                        >
                                            {card.icon}
                                            <span className="contacto-social-card-name">{card.name}</span>
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contacto;
