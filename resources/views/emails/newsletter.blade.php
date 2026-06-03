<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $campaignSubject }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: #0c0c0e;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #e4e4e7;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            max-width: 640px;
            margin: 0 auto;
            background-color: #0c0c0e;
        }
        /* Header */
        .header {
            background: linear-gradient(135deg, #111114 0%, #1a1a1e 100%);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 32px 40px;
            text-align: center;
        }
        .logo-area {
            display: inline-block;
        }
        .logo-badge {
            display: inline-block;
            background: linear-gradient(135deg, #ca8a04, #eab308);
            color: #080808;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 4px 14px;
            border-radius: 999px;
            margin-bottom: 12px;
        }
        .logo-name {
            font-size: 22px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.01em;
        }
        .logo-name span {
            color: #eab308;
        }
        /* Hero */
        .hero {
            background: linear-gradient(180deg, #111114 0%, #0c0c0e 100%);
            padding: 48px 40px 36px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 200px;
            background: radial-gradient(ellipse, rgba(234,179,8,0.12) 0%, transparent 70%);
            pointer-events: none;
        }
        .hero h1 {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.3;
            margin-bottom: 12px;
        }
        .hero h1 span { color: #eab308; }
        /* Body */
        .body-content {
            padding: 36px 40px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            background-color: #0c0c0e;
            font-size: 15px;
            line-height: 1.75;
            color: #a1a1aa;
        }
        .body-content p { margin-bottom: 16px; }
        .body-content h2, .body-content h3 {
            color: #ffffff;
            margin: 24px 0 10px;
        }
        .body-content a {
            color: #eab308;
            text-decoration: none;
        }
        .body-content ul, .body-content ol {
            margin: 12px 0 12px 24px;
        }
        .body-content li {
            margin-bottom: 6px;
        }
        /* Divider */
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(234,179,8,0.25), transparent);
            margin: 0 40px;
        }
        /* Footer */
        .footer {
            padding: 28px 40px;
            text-align: center;
            background-color: #080808;
        }
        .footer p {
            font-size: 12px;
            color: #52525b;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        .footer a {
            color: #eab308;
            text-decoration: none;
            font-size: 12px;
        }
        .footer .unsubscribe {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Header / Logo -->
        <div class="header">
            <div class="logo-area">
                <div class="logo-badge">Newsletter</div>
                <div class="logo-name">Laman<span>Teknologi</span></div>
            </div>
        </div>

        <!-- Subject / Hero -->
        <div class="hero">
            <h1>{{ $campaignSubject }}</h1>
        </div>

        <!-- Body Content -->
        <div class="body-content">
            {!! $campaignBody !!}
        </div>

        <div class="divider"></div>

        <!-- Footer -->
        <div class="footer">
            <p>
                E-mel ini dihantar kepada anda kerana anda telah melanggan newsletter kami.<br />
                <em>This email was sent to you because you subscribed to our newsletter.</em>
            </p>
            <p>
                <a href="{{ config('app.url') }}">{{ config('app.url') }}</a>
            </p>
            <div class="unsubscribe">
                <p>Ingin berhenti melanggan? Hubungi kami di <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a></p>
            </div>
        </div>
    </div>
</body>
</html>
