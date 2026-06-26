import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { sileo } from 'sileo';
import Footer from '../components/layout/Footer';

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
            icon: <FaGithub size={40} className="group-hover:scale-110 transition-transform" />,
            href: "https://github.com/LautaroLeall",
            colorClass: "hover:bg-white/10 hover:border-white/30 text-gray-300 hover:text-white"
        },
        {
            name: "LinkedIn",
            icon: <FaLinkedin size={40} className="group-hover:scale-110 transition-transform text-blue-400 group-hover:text-blue-500" />,
            href: "https://www.linkedin.com/in/lauldp/",
            colorClass: "hover:bg-blue-500/10 hover:border-blue-500/50 text-gray-300 hover:text-white"
        },
        {
            name: "WhatsApp",
            icon: <FaWhatsapp size={40} className="group-hover:scale-110 transition-transform text-green-400 group-hover:text-green-500" />,
            href: "https://api.whatsapp.com/send/?phone=543813399463&text&type=phone_number&app_absent=0",
            colorClass: "hover:bg-green-500/10 hover:border-green-500/50 text-gray-300 hover:text-white"
        },
        {
            name: "lautaroleal4@gmail.com",
            icon: <Mail size={40} className="text-nova-cyan" />,
            href: null,
            colorClass: "bg-nova-cyan/10 border-nova-cyan/30 text-white cursor-default",
            isEmail: true
        }
    ];

    return (
        <div className="relative min-h-screen bg-nova-bg overflow-hidden flex flex-col">

            {/* Fondo Decorativo Estático */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-nova-cyan rounded-full blur-[150px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-125 h-125 bg-[#6d28d9] rounded-full blur-[200px]" />
            </div>

            <div className="relative z-10 pt-28 pb-12 px-6 max-w-6xl mx-auto flex flex-col flex-1 w-full min-h-screen">

                {/* ── HEADER DE SECCIÓN (Desaparece con el scroll) ── */}
                <motion.div
                    style={{ y: titleY, opacity: titleOpacity }}
                    className="text-center mb-8"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4"
                    >
                        Ponte en <span className="nova-gradient-text">Contacto</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto"
                    >
                        ¿Tienes un proyecto en mente o consultas sobre Nova SetUp? Escríbeme.
                    </motion.p>
                </motion.div>

                {/* ── CONTENIDO PRINCIPAL (Form + Redes) ── */}
                <div className="flex-1 flex flex-col justify-center items-center w-full pb-10">
                    <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center w-full max-w-5xl">

                        {/* Formulario */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6 }}
                            className="flex-1 w-full bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Hablemos</h2>
                                <p className="text-gray-400">Envíame un mensaje directo a mi correo.</p>
                            </div>

                            <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">Nombre</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        required
                                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nova-cyan transition-colors"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        required
                                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nova-cyan transition-colors"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">Mensaje</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="4"
                                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nova-cyan transition-colors resize-none"
                                        placeholder="¿En qué te puedo ayudar?"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 bg-nova-cyan text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-pulse">Enviando...</span>
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
                        <div className="w-full md:w-80 flex flex-col gap-4">
                            {socialCards.map((card, index) => (
                                <motion.div
                                    key={card.name}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.15) }} // Retraso escalonado
                                    className="flex-1"
                                >
                                    {card.isEmail ? (
                                        <div className={`h-full w-full flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-3xl p-6 transition-all group ${card.colorClass}`}>
                                            {card.icon}
                                            <span className="font-bold text-sm text-center">{card.name}</span>
                                        </div>
                                    ) : (
                                        <a
                                            href={card.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`h-full w-full flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-3xl p-6 transition-all group ${card.colorClass}`}
                                        >
                                            {card.icon}
                                            <span className="font-bold tracking-wider">{card.name}</span>
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
