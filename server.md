ssh-keygen -t ed25519 -C "ec2-access-jerome-aiplan" -f ~/.ssh/repo-jerome-aiplan-key

cat ~/.ssh/repo-jerome-aiplan-key.pub

nano ~/.ssh/config

Host github.com-jerome-aiplan
  HostName github.com
  User git
  IdentityFile ~/.ssh/repo-jerome-aiplan-key
  IdentitiesOnly yes

git clone git@github.com-jerome-aiplan:deepGIVAn/30daysaiplan.git

----------------------------------------------------------------------------------------

sudo nano /etc/nginx/sites-available/30daysaiplan.jeromejoseph.com

server {
    listen 80;
    listen [::]:80;
    server_name 30daysaiplan.jeromejoseph.com www.30daysaiplan.jeromejoseph.com;
    
    client_max_body_size 1500M;
    
    location / {
        proxy_pass http://127.0.0.1:3018;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Handle client-side routing (for SPAs)
        try_files $uri $uri/ @fallback;
    }
  
    # Fallback for SPA routing
    location @fallback {
        proxy_pass http://127.0.0.1:3018;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
  
    # Allow Certbot to validate domain
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
  
    # Basic security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
  
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types 
        text/plain 
        text/css 
        text/xml 
        text/javascript 
        application/javascript 
        application/xml+rss 
        application/json
        application/xml
        image/svg+xml;
  
    # Logs
    access_log /var/log/nginx/aiplan_access.log;
    error_log /var/log/nginx/aiplan_error.log;
}

---------------------------------------------------------------------------------------------

sudo ln -s /etc/nginx/sites-available/30daysaiplan.jeromejoseph.com /etc/nginx/sites-enabled/

sudo certbot --nginx -d 30daysaiplan.jeromejoseph.com -d www.30daysaiplan.jeromejoseph.com
