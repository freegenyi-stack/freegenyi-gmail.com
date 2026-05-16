CREATE TABLE "children" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"secondary_parent_id" integer,
	"name" text NOT NULL,
	"age" integer,
	"grade" varchar(10),
	"language" varchar(5) DEFAULT 'ar',
	"country" varchar(5) DEFAULT 'DZ',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"full_name" text,
	"phone" text,
	"role" varchar(20) DEFAULT 'parent',
	"declared_country" varchar(5) DEFAULT 'DZ',
	"email_verified" boolean DEFAULT false,
	"verification_token" text,
	"verification_token_expires_at" timestamp,
	"family_id" integer,
	"onboarding_step" integer DEFAULT 1,
	"login_attempts" integer DEFAULT 0,
	"locked_until" timestamp,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_secondary_parent_id_users_id_fk" FOREIGN KEY ("secondary_parent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;