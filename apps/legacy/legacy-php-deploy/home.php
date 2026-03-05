<?php
session_start();
if (!isset($_SESSION['site_unlocked']) || $_SESSION['site_unlocked'] !== true) {
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreeGeny - Premium Learning</title>

    <!-- Fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Nunito:wght@400;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Titan+One&display=swap"
        rel="stylesheet">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#9D4EDD',
                        'primary-dark': '#7B2CBF',
                        'primary-light': '#C77DFF',
                        secondary: '#FFD60A',
                        'secondary-dark': '#FFC300',
                        accent: '#FFD60A',
                        dark: '#0F172A',
                        'dark-light': '#334155',
                        light: '#F8FAFC',
                    },
                    fontFamily: {
                        heading: ['Fredoka', 'sans-serif'],
                        body: ['Nunito', 'sans-serif'],
                        accent: ['Space+Grotesk', 'sans-serif'],
                        titan: ['Titan One', 'cursive'],
                    },
                    animation: {
                        'shimmer': 'shimmer 2s linear infinite',
                        'fade-in': 'fadeIn 0.5s ease-out forwards',
                        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        shimmer: {
                            '0%': { backgroundPosition: '-200% 0' },
                            '100%': { backgroundPosition: '200% 0' },
                        },
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' },
                        },
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                    }
                }
            }
        }
    </script>

    <style type="text/css">
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }

        .logo-shimmer {
            background: linear-gradient(90deg, #9D4EDD, #FFD60A, #9D4EDD);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s linear infinite;
        }

        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(to right, #9D4EDD, #FFD60A);
            z-index: 1100;
            transition: width 0.1s;
        }

        .nav-link-indicator {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(to right, #9D4EDD, #FFD60A);
            transition: all 0.3s ease;
        }

        .nav-link:hover .nav-link-indicator {
            width: 100%;
        }

        /* RTL Adjustments */
        [dir="rtl"] .font-heading {
            font-family: 'Fredoka', 'Nunito', sans-serif;
        }

        /* Smooth Scroll */
        html {
            scroll-behavior: smooth;
        }
    </style>
</head>

<body class="bg-white min-h-screen font-body text-dark overflow-x-hidden">
    <div class="scroll-progress" id="progress-bar"></div>

    <!-- Navigation -->
    <nav id="navbar"
        class="fixed top-0 left-0 right-0 z-[1000] h-[80px] flex items-center bg-white/70 backdrop-blur-[40px] border-b border-black/5 transition-all duration-300">
        <div class="w-full px-10 flex justify-between items-center max-w-[1920px] mx-auto">
            <a href="/"
                class="font-heading font-black text-2xl logo-shimmer group transition-all duration-300 hover:scale-105">
                FreeGeny
            </a>

            <!-- Desktop Links -->
            <div class="hidden lg:flex items-center gap-[12px]">
                <a href="#app"
                    class="nav-link relative py-2 px-3 text-[13px] font-heading font-black text-dark hover:text-primary transition-colors">
                    <span data-i18n="nav_app">App</span>
                    <div class="nav-link-indicator"></div>
                </a>
                <a href="#parents"
                    class="nav-link relative py-2 px-3 text-[13px] font-heading font-black text-dark hover:text-primary transition-colors">
                    <span data-i18n="nav_parents">Parents</span>
                    <div class="nav-link-indicator"></div>
                </a>
                <a href="#schools"
                    class="nav-link relative py-2 px-3 text-[13px] font-heading font-black text-dark hover:text-primary transition-colors">
                    <span data-i18n="nav_schools">Schools</span>
                    <div class="nav-link-indicator"></div>
                </a>
                <a href="#philosophy"
                    class="nav-link relative py-2 px-3 text-[13px] font-heading font-black text-dark hover:text-primary transition-colors">
                    <span data-i18n="nav_method">Philosophy</span>
                    <div class="nav-link-indicator"></div>
                </a>
            </div>

            <div class="flex items-center gap-4">
                <!-- Mobile Hidden Login Buttons -->
                <div class="hidden md:flex gap-3">
                    <a href="login.html?mode=signup"
                        class="px-5 py-2.5 rounded-xl font-heading font-bold text-dark hover:bg-gray-50 border border-gray-200 text-sm whitespace-nowrap"
                        data-i18n="btn_signup">Signup</a>
                    <a href="login.html"
                        class="px-5 py-2.5 rounded-xl font-heading font-bold bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all text-sm whitespace-nowrap"
                        data-i18n="btn_login">Login</a>
                </div>

                <!-- Language Selector -->
                <div class="relative group" id="lang-selector">
                    <button
                        class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full font-heading font-black text-[13px] min-w-[110px] hover:bg-white hover:border-primary-light transition-all shadow-sm"
                        id="lang-btn">
                        <span id="current-lang-flag">🇺🇸</span>
                        <span id="current-lang-code" class="uppercase">EN</span>
                        <svg class="w-3 h-3 transition-transform group-hover:rotate-180" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>
                    </button>
                    <!-- Dropdown -->
                    <div
                        class="absolute top-full end-0 mt-3 w-64 glass-card rounded-[24px] overflow-hidden hidden group-hover:block animate-fade-in z-[1100] p-3">
                        <div class="max-h-[400px] overflow-y-auto grid grid-cols-1 gap-1" id="lang-list">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>

                <!-- Burger Menu Toggle -->
                <button class="lg:hidden flex flex-col gap-1.5" onclick="toggleMobileMenu()">
                    <span class="w-6 h-0.5 bg-dark rounded-full"></span>
                    <span class="w-6 h-0.5 bg-dark rounded-full"></span>
                    <span class="w-6 h-0.5 bg-dark rounded-full"></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div id="mobile-menu" class="fixed inset-0 bg-white z-[999] hidden flex-col p-10 pt-32 gap-6 items-center">
        <a href="#app" class="text-2xl font-heading font-black text-dark" onclick="toggleMobileMenu()">App</a>
        <a href="#parents" class="text-2xl font-heading font-black text-dark" onclick="toggleMobileMenu()">Parents</a>
        <a href="#schools" class="text-2xl font-heading font-black text-dark" onclick="toggleMobileMenu()">Schools</a>
        <a href="login.html" class="px-8 py-4 bg-primary text-white rounded-2xl font-heading font-black text-xl"
            data-i18n="btn_login">Login</a>
    </div>

    <!-- 1. Hero Section -->
    <section class="relative pt-32 pb-20 px-6 sm:px-8 overflow-hidden">
        <div class="max-w-7xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div class="z-10 relative">
                    <div
                        class="inline-flex items-center px-4 py-2 bg-primary/5 rounded-full text-sm font-heading font-black text-primary mb-6 animate-fade-in">
                        <span class="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                        <span data-i18n="nav_tagline">Magic Learning</span>
                    </div>
                    <h1
                        class="text-5xl md:text-6xl lg:text-7xl text-dark mb-6 font-heading font-black leading-[1.1] animate-fade-in-up">
                        <span data-i18n="hero_title_1">Smart Play</span><br />
                        <span class="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
                            data-i18n="hero_title_2">Future Geny</span>
                    </h1>
                    <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl font-body animate-fade-in-up"
                        data-i18n="hero_subtitle">
                        Unlock potential...
                    </p>
                    <p class="text-lg text-gray-500 mb-8 leading-relaxed max-w-xl font-body opacity-80 animate-fade-in-up"
                        data-i18n="hero_details">
                        Advanced learning...
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
                        <a href="login.html"
                            class="bg-primary hover:bg-primary-dark text-white font-heading font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/25 text-lg text-center"
                            data-i18n="btn_start_adventure">
                            Start Adventure 🚀
                        </a>
                        <a href="#how-it-works"
                            class="bg-white hover:bg-gray-50 text-dark font-heading font-black px-8 py-4 rounded-xl transition-all border-2 border-gray-100 shadow-md hover:shadow-lg text-lg text-center"
                            data-i18n="btn_learn_more">
                            Learn More
                        </a>
                    </div>

                    <p class="text-sm text-gray-500 mt-6 italic opacity-80 font-accent" data-i18n="slogan_magic"></p>

                    <!-- Hero Stats -->
                    <div class="flex items-center gap-10 mt-12 border-t border-gray-100 pt-8 animate-fade-in-up">
                        <div>
                            <div class="text-3xl font-heading font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent italic"
                                data-i18n="stat_users_val">1M+</div>
                            <div class="text-sm font-heading font-black text-gray-600 uppercase tracking-wider"
                                data-i18n="stat_users">Users</div>
                        </div>
                        <div>
                            <div class="text-3xl font-heading font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent italic"
                                data-i18n="stat_countries_val">38</div>
                            <div class="text-sm font-heading font-black text-gray-600 uppercase tracking-wider"
                                data-i18n="stat_countries">Countries</div>
                        </div>
                        <div>
                            <div class="text-3xl font-heading font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent italic"
                                data-i18n="stat_rating_val">4.9/5</div>
                            <div class="text-sm font-heading font-black text-gray-600 uppercase tracking-wider"
                                data-i18n="stat_rating">Rating</div>
                        </div>
                    </div>
                </div>

                <div class="relative group lg:block">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[40px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity">
                    </div>
                    <div
                        class="relative z-10 aspect-square bg-gradient-to-br from-light to-white rounded-[40px] flex items-center justify-center border-4 border-white shadow-2xl p-12">
                        <div class="w-full h-full bg-primary/5 rounded-[30px] flex items-center justify-center">
                            <span class="font-titan text-8xl text-primary/20" data-i18n="brand_short">FG</span>
                        </div>
                    </div>
                    <div class="absolute -top-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse">
                    </div>
                    <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse"
                        style="animation-delay: 1s;"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- 2. App Features Section -->
    <section id="app" class="py-24 px-6 bg-light/50">
        <div class="max-w-7xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div class="order-2 lg:order-1 grid grid-cols-2 gap-6">
                    <div
                        class="p-8 rounded-3xl bg-blue-50 border border-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                        <div class="text-4xl mb-4">🧩</div>
                        <div class="font-heading font-black text-dark" data-i18n="feat_logic_puzzles">Logic Puzzles
                        </div>
                    </div>
                    <div
                        class="p-8 rounded-3xl bg-green-50 border border-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                        <div class="text-4xl mb-4">🔢</div>
                        <div class="font-heading font-black text-dark" data-i18n="feat_math_games">Math Games</div>
                    </div>
                    <div
                        class="p-8 rounded-3xl bg-amber-50 border border-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                        <div class="text-4xl mb-4">💻</div>
                        <div class="font-heading font-black text-dark" data-i18n="feat_coding_basics">Coding Basics
                        </div>
                    </div>
                    <div
                        class="p-8 rounded-3xl bg-purple-50 border border-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                        <div class="text-4xl mb-4">🧠</div>
                        <div class="font-heading font-black text-dark" data-i18n="feat_brain_training">Brain Training
                        </div>
                    </div>
                </div>
                <div class="order-1 lg:order-2">
                    <h2 class="text-4xl md:text-5xl font-heading font-black text-dark mb-8 leading-tight"
                        data-i18n="nav_app">The App</h2>
                    <p class="text-xl text-gray-600 mb-8 leading-relaxed font-body" data-i18n="desc_app"></p>
                    <p class="text-lg text-gray-500 mb-10 italic font-accent" data-i18n="desc_app_sub"></p>
                    <button
                        class="bg-primary hover:bg-primary-dark text-white font-heading font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
                        data-i18n="btn_explore_parent">
                        Explore
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- 3. How It Works -->
    <section id="how-it-works" class="py-24 px-6 bg-white">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <h2 class="text-4xl md:text-5xl font-heading font-black text-dark mb-6" data-i18n="hiw_title">How It
                    Works</h2>
                <div class="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-8"></div>
            </div>
            <div class="grid md:grid-cols-3 gap-10">
                <div
                    class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div
                        class="w-16 h-16 bg-primary/10 text-3xl flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                        🎮</div>
                    <h3 class="text-2xl font-heading font-black text-dark mb-4" data-i18n="hiw_step1_title">Step 1</h3>
                    <p class="text-gray-600 leading-relaxed text-lg font-body" data-i18n="hiw_step1_desc"></p>
                </div>
                <div
                    class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div
                        class="w-16 h-16 bg-secondary/10 text-3xl flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                        🤖</div>
                    <h3 class="text-2xl font-heading font-black text-dark mb-4" data-i18n="hiw_step2_title">Step 2</h3>
                    <p class="text-gray-600 leading-relaxed text-lg font-body" data-i18n="hiw_step2_desc"></p>
                </div>
                <div
                    class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div
                        class="w-16 h-16 bg-accent/10 text-3xl flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                        👨‍👩‍👧‍👦</div>
                    <h3 class="text-2xl font-heading font-black text-dark mb-4" data-i18n="hiw_step3_title">Step 3</h3>
                    <p class="text-gray-600 leading-relaxed text-lg font-body" data-i18n="hiw_step3_desc"></p>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. Vision -->
    <section id="vision" class="py-24 px-6 bg-light/30">
        <div class="max-w-7xl mx-auto">
            <div class="glass-card p-16 rounded-[40px] relative overflow-hidden">
                <div class="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <h2 class="text-4xl md:text-5xl font-heading font-black text-dark mb-8 leading-tight"
                            data-i18n="vision_title">Our Vision</h2>
                        <blockquote class="text-2xl font-heading font-black text-primary mb-6 italic"
                            data-i18n="vision_q"></blockquote>
                        <p class="text-xl text-gray-600 mb-8 leading-relaxed font-body" data-i18n="vision_highlight">
                        </p>
                        <p class="text-lg text-gray-500 leading-relaxed font-body" data-i18n="vision_desc"></p>
                    </div>
                    <div class="text-center">
                        <div
                            class="w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
                            <span class="text-6xl">🎯</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. Parents Section -->
    <section id="parents" class="py-24 px-6 bg-white">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <h2 class="text-4xl md:text-5xl font-heading font-black text-dark mb-6" data-i18n="nav_parents">Parents
                </h2>
                <div class="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-8"></div>
            </div>
            <div class="grid md:grid-cols-3 gap-10">
                <div
                    class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div
                        class="w-16 h-16 bg-primary/10 text-3xl flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                        📊</div>
                    <h3 class="text-2xl font-heading font-black text-dark mb-4" data-i18n="title_insights">Insights</h3>
                    <p class="text-gray-600 leading-relaxed text-lg font-body" data-i18n="desc_insights"></p>
                </div>
                <div
                    class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div
                        class="w-16 h-16 bg-secondary/10 text-3xl flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                        🛡️</div>
                    <h3 class="text-2xl font-heading font-black text-dark mb-4" data-i18n="title_safety">Safety</h3>
                    <p class="text-gray-600 leading-relaxed text-lg font-body" data-i18n="desc_safety"></p>
                </div>
                <div
                    class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div
                        class="w-16 h-16 bg-accent/10 text-3xl flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                        ⏰</div>
                    <h3 class="text-2xl font-heading font-black text-dark mb-4" data-i18n="title_control">Control</h3>
                    <p class="text-gray-600 leading-relaxed text-lg font-body" data-i18n="desc_control"></p>
                </div>
            </div>
        </div>
    </section>

    <!-- 6. Testimonials -->
    <section id="testimonials" class="py-24 px-6 bg-light/50">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <h2 class="text-4xl md:text-5xl font-heading font-black text-dark mb-6" data-i18n="test_title">Hear
                    from...</h2>
                <div class="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-8"></div>
            </div>
            <div class="grid md:grid-cols-2 gap-10 mb-16">
                <div class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                    <p class="text-lg text-gray-600 mb-6 italic font-body" data-i18n="test1_text"></p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-heading font-black text-primary"
                            data-i18n="test1_initials">MA</div>
                        <div>
                            <div class="font-heading font-black text-dark" data-i18n="test1_author">Mary</div>
                            <div class="text-sm text-gray-500" data-i18n="test1_role">Parent</div>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                    <p class="text-lg text-gray-600 mb-6 italic font-body" data-i18n="test2_text"></p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center font-heading font-black text-secondary"
                            data-i18n="test2_initials">JD</div>
                        <div>
                            <div class="font-heading font-black text-dark" data-i18n="test2_author">John</div>
                            <div class="text-sm text-gray-500" data-i18n="test2_role">Teacher</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 7. Schools -->
    <section id="schools" class="py-24 px-6 bg-white">
        <div class="max-w-7xl mx-auto">
            <div class="glass-card p-16 rounded-[40px]">
                <div class="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 class="text-4xl md:text-5xl font-heading font-black text-dark mb-8 leading-tight"
                            data-i18n="nav_schools">Schools</h2>
                        <p class="text-xl text-gray-600 mb-8 leading-relaxed font-body" data-i18n="desc_schools"></p>
                        <button
                            class="bg-dark hover:bg-gray-800 text-white font-heading font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-xl"
                            data-i18n="btn_partner">Partner</button>
                    </div>
                    <div class="text-center">
                        <div
                            class="w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
                            <span class="text-6xl">🏫</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 8. Organizations Section -->
    <section id="org" class="py-24 px-6 bg-light/50">
        <div class="max-w-7xl mx-auto">
            <div class="glass-card p-16 rounded-3xl">
                <div class="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 class="text-4xl md:text-5xl font-heading font-black text-dark mb-8 leading-tight"
                            data-i18n="nav_org">Organizations</h2>
                        <p class="text-xl text-gray-600 mb-8 leading-relaxed font-body" data-i18n="desc_org"></p>
                        <button
                            class="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-heading font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-xl"
                            data-i18n="btn_proposal">Get Proposal</button>
                    </div>
                    <div class="text-center">
                        <div
                            class="w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
                            <span class="text-6xl">🤝</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 9. Philosophy Section -->
    <section id="philosophy" class="py-24 px-6 bg-white">
        <div class="max-w-7xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-16">
                <div class="glass-card p-16 rounded-3xl border-t-4 border-primary">
                    <div class="text-sm font-heading font-black text-primary mb-6 uppercase tracking-wider"
                        data-i18n="lbl_mission">Mission</div>
                    <h3 class="text-3xl font-heading font-black text-dark mb-6" data-i18n="mission_title">Title</h3>
                    <p class="text-lg text-gray-600 leading-relaxed font-body mb-8" data-i18n="mission_desc"></p>
                </div>
                <div class="glass-card p-16 rounded-3xl border-t-4 border-secondary">
                    <div class="text-sm font-heading font-black text-secondary mb-6 uppercase tracking-wider"
                        data-i18n="lbl_who">Who we are</div>
                    <h3 class="text-3xl font-heading font-black text-dark mb-6" data-i18n="about_title">About Us</h3>
                    <p class="text-lg text-gray-600 leading-relaxed font-body" data-i18n="about_desc"></p>
                </div>
            </div>
        </div>
    </section>

    <!-- 10. CTA Section -->
    <section class="py-24 px-6 bg-dark text-white overflow-hidden relative">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div class="max-w-4xl mx-auto text-center relative z-10">
            <h2 class="text-4xl md:text-6xl font-heading font-black mb-8 leading-tight" data-i18n="ready_title">Ready?
            </h2>
            <p class="text-2xl text-gray-400 mb-12 font-body" data-i18n="ready_desc"></p>
            <div class="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="login.html"
                    class="bg-primary hover:bg-primary-dark text-white font-heading font-black px-12 py-6 rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-primary/40 text-xl uppercase tracking-wider"
                    data-i18n="btn_start_adventure">
                    Let's Go 🚀
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 pt-20 pb-10">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div>
                    <span class="font-titan text-2xl logo-shimmer">FreeGeny</span>
                    <p class="mt-4 text-dark-light font-bold leading-relaxed opacity-80" data-i18n="mission_desc"></p>
                </div>
                <div>
                    <h3 class="text-dark font-black mb-6" data-i18n="ft_product">Product</h3>
                    <ul class="space-y-4 text-dark-light font-bold">
                        <li><a href="#app" data-i18n="nav_app">App</a></li>
                        <li><a href="#parents" data-i18n="nav_parents">Parents</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-dark font-black mb-6" data-i18n="nav_about">About</h3>
                    <ul class="space-y-4 text-dark-light font-bold">
                        <li><a href="#vision" data-i18n="nav_mission">Mission</a></li>
                        <li><a href="#philosophy" data-i18n="nav_method">Method</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-dark font-black mb-6" data-i18n="ft_legal">Legal</h3>
                    <ul class="space-y-4 text-dark-light font-bold">
                        <li><a href="#" data-i18n="ft_privacy">Privacy</a></li>
                        <li><a href="#" data-i18n="ft_terms">Terms</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-100 pt-10 text-center opacity-60 text-sm font-bold" data-i18n="ft_rights">
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="assets/js/i18n-modern.js"></script>
    <script>
        const LANGUAGES = {
            'en': { name: 'English', flag: '🇺🇸' }, 'fr': { name: 'Français', flag: '🇫🇷' },
            'es': { name: 'Español', flag: '🇪🇸' }, 'zh': { name: '中文', flag: '🇨🇳' },
            'ar': { name: 'العربية', flag: '🇸🇦' }, 'ru': { name: 'Русский', flag: '🇷🇺' },
            'pt': { name: 'Português', flag: '🇵🇹' }, 'de': { name: 'Deutsch', flag: '🇩🇪' },
            'hi': { name: 'हिन्दी', flag: '🇮🇳' }, 'bn': { name: 'বাংলা', flag: '🇧🇩' },
            'ja': { name: '日本語', flag: '🇯🇵' }, 'ko': { name: '한국어', flag: '🇰🇷' },
            'tr': { name: 'Türkçe', flag: '🇹🇷' }, 'it': { name: 'Italiano', flag: '🇮🇹' },
            'nl': { name: 'Nederlands', flag: '🇳🇱' }, 'pl': { name: 'Polski', flag: '🇵🇱' },
            'vi': { name: 'Tiếng Việt', flag: '🇻🇳' }, 'id': { name: 'Indonesia', flag: '🇮🇩' },
            'th': { name: 'ไทย', flag: '🇹🇭' }, 'sw': { name: 'Kiswahili', flag: '🇹🇿' },
            'uk': { name: 'Українська', flag: '🇺🇦' }, 'ur': { name: 'اردو', flag: '🇵🇰' },
            'fa': { name: 'فارسی', flag: '🇮🇷' }, 'ro': { name: 'Română', flag: '🇷🇴' },
            'hu': { name: 'Magyar', flag: '🇭🇺' }, 'cs': { name: 'Čeština', flag: '🇨🇿' },
            'el': { name: 'Ελληνικά', flag: '🇬🇷' }, 'sv': { name: 'Svenska', flag: '🇸🇪' },
            'da': { name: 'Dansk', flag: '🇩🇰' }, 'no': { name: 'Norsk', flag: '🇳🇴' },
            'fi': { name: 'Suomi', flag: '🇫🇮' }, 'ca': { name: 'Català', flag: '🇪🇸' },
            'ga': { name: 'Gaeilge', flag: '🇮🇪' }, 'sq': { name: 'Shqip', flag: '🇦🇱' },
            'hr': { name: 'Hrvatski', flag: '🇭🇷' }, 'sr': { name: 'Српски', flag: '🇷🇸' },
            'sl': { name: 'Slovenščina', flag: '🇸🇮' }, 'bg': { name: 'Български', flag: '🇧🇬' },
            'be': { name: 'Беларуская', flag: '🇧🇾' }, 'mk': { name: 'Македонски', flag: '🇲🇰' },
            'lt': { name: 'Lietuvių', flag: '🇱🇹' }, 'lv': { name: 'Latviešu', flag: '🇱Ｖ' },
            'et': { name: 'Eesti', flag: '🇪🇪' }, 'is': { name: 'Íslenska', flag: '🇮🇸' },
            'mt': { name: 'Malti', flag: '🇲Ｔ' }, 'cy': { name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
            'pcm': { name: 'Nigerian Pidgin', flag: '🇳🇬' }, 'ha': { name: 'Hausa', flag: '🇳🇬' },
            'tl': { name: 'Tagalog', flag: '🇵🇭' }, 'jv': { name: 'Javanese', flag: '🇮🇩' },
            'eu': { name: 'Euskara', flag: '🇪🇸' }, 'gl': { name: 'Galego', flag: '🇪🇸' },
            'pnb': { name: 'پنجابی', flag: '🇵🇰' }
        };

        function populateLangList() {
            const list = document.getElementById('lang-list');
            Object.entries(LANGUAGES).forEach(([code, data]) => {
                const btn = document.createElement('button');
                btn.className = "flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 text-dark font-heading font-black text-[13px] rounded-xl transition-all w-full text-left group/item";
                btn.onclick = () => window.i18n.setLang(code);
                btn.innerHTML = `<span>${data.flag}</span> <span class="group-hover/item:text-primary transition-colors">${data.name}</span>`;
                list.appendChild(btn);
            });
        }

        window.addEventListener('langChanged', (e) => {
            const { locale } = e.detail;
            const langData = LANGUAGES[locale] || LANGUAGES.en;
            document.getElementById('current-lang-flag').innerText = langData.flag;
            document.getElementById('current-lang-code').innerText = locale.toUpperCase();
        });

        // Toggle Mobile Menu
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
            menu.classList.toggle('flex');
        }

        // Scroll Effects
        window.onscroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById("progress-bar").style.width = scrolled + "%";

            const navbar = document.getElementById('navbar');
            if (winScroll > 20) {
                navbar.classList.add('py-2', 'shadow-lg');
                navbar.classList.remove('h-[80px]');
            } else {
                navbar.classList.remove('py-2', 'shadow-lg');
                navbar.classList.add('h-[80px]');
            }
        };

        document.addEventListener('DOMContentLoaded', populateLangList);
    </script>
</body>

</html>