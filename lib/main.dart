import 'package:flutter/material.dart';

void main() {
  runApp(const FreeGenyApp());
}

class FreeGenyApp extends StatelessWidget {
  const FreeGenyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FreeGeny',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF09A1A1), // Teal
          primary: const Color(0xFF09A1A1),
          secondary: const Color(0xFFD396A6), // Pink
        ),
        fontFamily: 'Nunito',
      ),
      home: const RoleSelectionPage(),
    );
  }
}

class RoleSelectionPage extends StatelessWidget {
  const RoleSelectionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.white,
              const Color(0xFF09A1A1).withOpacity(0.05),
              const Color(0xFFD396A6).withOpacity(0.05),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              Hero(
                tag: 'logo',
                child: Container(
                  width: 120,
                  height: 120,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 30,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Image.asset('assets/logo.png'),
                ),
              ),
              const SizedBox(height: 40),
              
              const Text(
                'Welcome to FreeGeny',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF09A1A1),
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Select your magic portal',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                  fontWeight: FontWeight.w600,
                ),
              ),
              
              const SizedBox(height: 60),

              // Selection Cards
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Row(
                  children: [
                    Expanded(
                      child: _RoleCard(
                        title: 'Explorer',
                        subtitle: 'Children',
                        icon: Icons.auto_awesome,
                        color: const Color(0xFF09A1A1),
                        onTap: () {
                          // TODO: Navigate to Child View
                        },
                      ),
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: _RoleCard(
                        title: 'Guardian',
                        subtitle: 'Parents/Schools',
                        icon: Icons.shield,
                        color: const Color(0xFFD396A6),
                        onTap: () {
                          // TODO: Navigate to Parent View
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 180,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: color.withOpacity(0.1), width: 2),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 30),
            ),
            const SizedBox(height: 15),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 18,
                color: color,
              ),
            ),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
