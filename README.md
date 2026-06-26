# ⚙️ Nova SetUp

Plataforma E-commerce completa desarrollada para **Nova SetUp**, especialistas en equipamiento premium para profesionales.  
Una tienda en línea interactiva, de alto rendimiento y con un diseño inmersivo, enfocada en la venta de teclados mecánicos, iluminación inteligente y el armado personalizado de setups ideales.

> **Elevamos el nivel de tu espacio de trabajo y juego.**

---

## 🌐 Ver Proyecto Online

[![Nova SetUp Frontend](https://img.shields.io/badge/Nova%20SetUp%20Frontend-3adbf1?style=for-the-badge&logo=vercel&logoColor=black)](https://nova-setup.vercel.app/)

---

## 📌 Características Principales

- ✅ **Diseño Premium & Inmersivo**  
  Estética "Gamer/Premium" con una paleta de colores cuidadosamente curada (Negro Profundo, Cyan Nova, Violeta) y un enfoque en modo oscuro moderno (Glassmorphism), transmitiendo tecnología de alta gama.

- ✅ **Simulador "Arma tu PC"**  
  Un asistente interactivo por pasos para ensamblar tu computadora seleccionando CPU, Placa Madre, RAM, GPU y Almacenamiento. Incluye validaciones, presupuesto en tiempo real y componentes compatibles.

- ✅ **Panel de Administración (Admin Dashboard)**  
  Área protegida completa para gestionar el inventario de productos, revisar órdenes de compra, gestionar usuarios registrados y visualizar métricas de ventas y estado de la tienda.

- ✅ **Flujo de Checkout y Carrito Lateral**  
  Carrito de compras asíncrono implementado con un Drawer lateral. Pasarela de pagos integrada para simular el ciclo de compra completo (Mercado Pago), junto con páginas de éxito o fallo de la transacción.

- ✅ **Experiencia de Usuario Animada (UX/UI)**  
  Animaciones fluidas al hacer scroll, un increíble efecto Parallax interactivo de una Mac en la página principal, ventanas modales y transiciones usando _Framer Motion_.

- ✅ **Totalmente Responsive**  
  Diseño adaptable 100% Mobile First, garantizando que el catálogo, la administración y la simulación de PC funcionen impecablemente en cualquier tamaño de pantalla.

---

## 🛠️ Tecnologías Utilizadas

- **React.js (v18+)** _(Desarrollo basado en Componentes)_
- **Vite** _(Build Tool extremadamente rápido)_
- **Tailwind CSS v4** _(Estilos modulares y utilidad atómica pura)_
- **Framer Motion** _(Animaciones 3D, parallax de scroll e interacciones complejas)_
- **React Router DOM v7** _(Ruteo de páginas completas, Layouts anidados y rutas privadas/admin)_
- **Lucide React** _(Iconografía limpia y moderna)_
- **SweetAlert2** _(Alertas atractivas y cuadros de diálogo amigables)_

---

## 📂 Estructura del Proyecto Front

```text
/src
├── components
│   ├── admin/             # (Tablas, modales de producto y gráficos)
│   ├── builder/           # (Lógica y UI del simulador de PC)
│   ├── cart/              # (Carrito lateral interactivo)
│   ├── checkout/          # (Formulario de pagos y resumen)
│   ├── home/              # (Landing page, Hero Parallax Mac)
│   ├── layout/            # (Navbar, Footer, Scroll To Top)
│   ├── product/           # (Tarjetas, galería de producto y reseñas)
│   ├── profile/           # (Sidebar de usuario, lista de órdenes)
│   └── shop/              # (Filtros y paginación)
│
├── context
│   ├── AuthContext.jsx    # (Gestión de sesión JWT y Favoritos)
│   ├── CartContext.jsx    # (Cálculos de precios y estados del carrito)
│   ├── PCBuilderContext.jsx # (Estados del simulador)
│   └── ProductContext.jsx # (Caché de productos y paginación)
│
├── layouts
│   └── MainLayout.jsx     # (Estructura global de cabecera y pie de página)
│
├── pages
│   ├── admin/             # (Secciones completas de administración)
│   ├── Checkout.jsx
│   ├── Contacto.jsx
│   ├── Home.jsx
│   ├── PCBuilder.jsx
│   ├── ProductDetail.jsx
│   ├── Shop.jsx
│   └── UserProfile.jsx
│
├── routes
│   ├── AppRoutes.jsx      # (Rutas públicas y mapeo principal)
│   └── ProtectedRoute.jsx # (Guardia de seguridad para usuarios y Admin)
│
├── services
│   └── api.js             # (Axios interceptors y configuración HTTP)
│
├── styles                 # (Archivos CSS para sobre-escritura)
├── App.jsx
└── main.jsx
```

---

## 🚀 Instalación y Uso Local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/LautaroLeall/E-commerce.git
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Variables de Entorno (.env)

Crea un archivo `.env` en la raíz de `/Front` con:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MERCADOPAGO_PUBLIC_KEY=tu_public_key
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

### 4️⃣ Iniciar servidor de desarrollo

```bash
npm run dev
```

---
