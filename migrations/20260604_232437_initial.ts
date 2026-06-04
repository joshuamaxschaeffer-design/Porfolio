import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_brand" AS ENUM('personal', 'practice');
  CREATE TYPE "public"."enum_pages_blocks_hero_background" AS ENUM('none', 'image', 'video', 'animation');
  CREATE TYPE "public"."enum_pages_blocks_text_section_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_image_grid_aspect_ratio" AS ENUM('natural', 'square', '4-3', '16-9', '3-4');
  CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_featured_work_layout" AS ENUM('single', 'two', 'three');
  CREATE TYPE "public"."enum_pages_blocks_case_study_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_lifecycle_section_phase" AS ENUM('strategy', 'brand', 'product', 'systems', 'launch');
  CREATE TYPE "public"."enum_pages_blocks_capabilities_style" AS ENUM('inline', 'pills', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_cta_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_blocks_motion_image_rounded" AS ENUM('none', 'sm', 'md', 'lg', 'xl', 'full');
  CREATE TYPE "public"."enum_pages_blocks_motion_image_shadow" AS ENUM('none', 'soft', 'dramatic', 'colored', 'drop-png');
  CREATE TYPE "public"."enum_pages_blocks_motion_image_hover" AS ENUM('none', 'lift', 'tilt-3d', 'parallax-skew');
  CREATE TYPE "public"."enum_pages_blocks_motion_image_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_lottie_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_marquee_logos_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_studies_brand" AS ENUM('personal', 'practice');
  CREATE TYPE "public"."enum_case_studies_blocks_hero_background" AS ENUM('none', 'image', 'video', 'animation');
  CREATE TYPE "public"."enum_case_studies_blocks_text_section_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_case_studies_blocks_image_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_case_studies_blocks_image_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_case_studies_blocks_image_grid_aspect_ratio" AS ENUM('natural', 'square', '4-3', '16-9', '3-4');
  CREATE TYPE "public"."enum_case_studies_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_case_studies_blocks_featured_work_layout" AS ENUM('single', 'two', 'three');
  CREATE TYPE "public"."enum_case_studies_blocks_case_study_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_case_studies_blocks_lifecycle_section_phase" AS ENUM('strategy', 'brand', 'product', 'systems', 'launch');
  CREATE TYPE "public"."enum_case_studies_blocks_capabilities_style" AS ENUM('inline', 'pills', 'grid');
  CREATE TYPE "public"."enum_case_studies_blocks_cta_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_case_studies_blocks_motion_image_rounded" AS ENUM('none', 'sm', 'md', 'lg', 'xl', 'full');
  CREATE TYPE "public"."enum_case_studies_blocks_motion_image_shadow" AS ENUM('none', 'soft', 'dramatic', 'colored', 'drop-png');
  CREATE TYPE "public"."enum_case_studies_blocks_motion_image_hover" AS ENUM('none', 'lift', 'tilt-3d', 'parallax-skew');
  CREATE TYPE "public"."enum_case_studies_blocks_motion_image_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_case_studies_blocks_lottie_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_case_studies_blocks_marquee_logos_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_logos_industry" AS ENUM('consumer', 'fintech', 'enterprise', 'b2b', 'agency', 'startup');
  CREATE TYPE "public"."enum_settings_social_links_platform" AS ENUM('linkedin', 'instagram', 'x', 'dribbble', 'readcv', 'github');
  CREATE TYPE "public"."enum_settings_brand" AS ENUM('personal', 'practice');
  CREATE TYPE "public"."enum_navigation_items_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_navigation_brand" AS ENUM('personal', 'practice');
  CREATE TYPE "public"."enum_footer_brand" AS ENUM('personal', 'practice');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "pages_brand" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_pages_brand",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar NOT NULL,
  	"subhead" varchar,
  	"background" "enum_pages_blocks_hero_background" DEFAULT 'none',
  	"background_media_id" integer,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"width" "enum_pages_blocks_text_section_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"width" "enum_pages_blocks_image_width" DEFAULT 'wide',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_image_grid_columns" DEFAULT '3',
  	"aspect_ratio" "enum_pages_blocks_image_grid_aspect_ratio" DEFAULT 'natural',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_featured_work_layout" DEFAULT 'two',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_case_study_grid_columns" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_count" numeric DEFAULT 8,
  	"randomize" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lifecycle_section_artifacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_lifecycle_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase" "enum_pages_blocks_lifecycle_section_phase" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"style" "enum_pages_blocks_capabilities_style" DEFAULT 'inline',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_values_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"cta_label" varchar NOT NULL,
  	"cta_url" varchar NOT NULL,
  	"align" "enum_pages_blocks_cta_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_motion_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar,
  	"skew_x" numeric DEFAULT 0,
  	"skew_y" numeric DEFAULT 0,
  	"rotate" numeric DEFAULT 0,
  	"rounded" "enum_pages_blocks_motion_image_rounded" DEFAULT 'md',
  	"shadow" "enum_pages_blocks_motion_image_shadow" DEFAULT 'soft',
  	"shadow_color" varchar DEFAULT '#000000',
  	"shadow_blur" numeric DEFAULT 30,
  	"shadow_offset_x" numeric DEFAULT 0,
  	"shadow_offset_y" numeric DEFAULT 12,
  	"mask_image_id" integer,
  	"hover" "enum_pages_blocks_motion_image_hover" DEFAULT 'none',
  	"tilt_max" numeric DEFAULT 12,
  	"width" "enum_pages_blocks_motion_image_width" DEFAULT 'wide',
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lottie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"loop" boolean DEFAULT true,
  	"autoplay" boolean DEFAULT true,
  	"play_on_hover" boolean DEFAULT false,
  	"width" "enum_pages_blocks_lottie_width" DEFAULT 'wide',
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"duration" numeric DEFAULT 40,
  	"direction" "enum_pages_blocks_marquee_logos_direction" DEFAULT 'left',
  	"pause_on_hover" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_baserate_case_study_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_baserate_case_study" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date_range" varchar,
  	"lead" varchar,
  	"role" varchar,
  	"challenge_heading" varchar,
  	"challenge_intro" varchar,
  	"architecture_intro" varchar,
  	"product_system_intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"nav_show_in_nav" boolean DEFAULT false,
  	"nav_label" varchar,
  	"nav_order" numeric DEFAULT 100,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer,
  	"logos_id" integer
  );
  
  CREATE TABLE "case_studies_brand" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_case_studies_brand",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "case_studies_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "case_studies_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar NOT NULL,
  	"subhead" varchar,
  	"background" "enum_case_studies_blocks_hero_background" DEFAULT 'none',
  	"background_media_id" integer,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"width" "enum_case_studies_blocks_text_section_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"width" "enum_case_studies_blocks_image_width" DEFAULT 'wide',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "case_studies_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_case_studies_blocks_image_grid_columns" DEFAULT '3',
  	"aspect_ratio" "enum_case_studies_blocks_image_grid_aspect_ratio" DEFAULT 'natural',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_case_studies_blocks_spacer_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_featured_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_case_studies_blocks_featured_work_layout" DEFAULT 'two',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_case_study_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_case_studies_blocks_case_study_grid_columns" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_count" numeric DEFAULT 8,
  	"randomize" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_lifecycle_section_artifacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "case_studies_blocks_lifecycle_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase" "enum_case_studies_blocks_lifecycle_section_phase" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_blocks_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"style" "enum_case_studies_blocks_capabilities_style" DEFAULT 'inline',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_values_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_blocks_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"cta_label" varchar NOT NULL,
  	"cta_url" varchar NOT NULL,
  	"align" "enum_case_studies_blocks_cta_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_motion_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar,
  	"skew_x" numeric DEFAULT 0,
  	"skew_y" numeric DEFAULT 0,
  	"rotate" numeric DEFAULT 0,
  	"rounded" "enum_case_studies_blocks_motion_image_rounded" DEFAULT 'md',
  	"shadow" "enum_case_studies_blocks_motion_image_shadow" DEFAULT 'soft',
  	"shadow_color" varchar DEFAULT '#000000',
  	"shadow_blur" numeric DEFAULT 30,
  	"shadow_offset_x" numeric DEFAULT 0,
  	"shadow_offset_y" numeric DEFAULT 12,
  	"mask_image_id" integer,
  	"hover" "enum_case_studies_blocks_motion_image_hover" DEFAULT 'none',
  	"tilt_max" numeric DEFAULT 12,
  	"width" "enum_case_studies_blocks_motion_image_width" DEFAULT 'wide',
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_lottie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"loop" boolean DEFAULT true,
  	"autoplay" boolean DEFAULT true,
  	"play_on_hover" boolean DEFAULT false,
  	"width" "enum_case_studies_blocks_lottie_width" DEFAULT 'wide',
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"duration" numeric DEFAULT 40,
  	"direction" "enum_case_studies_blocks_marquee_logos_direction" DEFAULT 'left',
  	"pause_on_hover" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_baserate_case_study_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_blocks_baserate_case_study" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date_range" varchar,
  	"lead" varchar,
  	"role" varchar,
  	"challenge_heading" varchar,
  	"challenge_intro" varchar,
  	"architecture_intro" varchar,
  	"product_system_intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_case_studies_status" DEFAULT 'draft',
  	"featured" boolean DEFAULT false,
  	"client" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"dates_start" varchar,
  	"dates_end" varchar,
  	"one_line_outcome" varchar NOT NULL,
  	"hero_image_id" integer,
  	"hero_video_id" integer,
  	"testimonial_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"case_studies_id" integer,
  	"logos_id" integer
  );
  
  CREATE TABLE "logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"image_dark_id" integer,
  	"link" varchar,
  	"industry" "enum_logos_industry",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar,
  	"company" varchar,
  	"headshot_id" integer,
  	"quote" varchar NOT NULL,
  	"project_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_settings_social_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" "enum_settings_brand" NOT NULL,
  	"site_name" varchar NOT NULL,
  	"tagline" varchar,
  	"default_o_g_image_id" integer,
  	"contact_email" varchar NOT NULL,
  	"cal_link" varchar,
  	"footer_copy" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_navigation_items_type" DEFAULT 'page',
  	"page_id" integer,
  	"external_url" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" "enum_navigation_brand" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" "enum_footer_brand" NOT NULL,
  	"copyright_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"case_studies_id" integer,
  	"logos_id" integer,
  	"testimonials_id" integer,
  	"tags_id" integer,
  	"media_id" integer,
  	"settings_id" integer,
  	"navigation_id" integer,
  	"footer_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_brand" ADD CONSTRAINT "pages_brand_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_section" ADD CONSTRAINT "pages_blocks_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid_images" ADD CONSTRAINT "pages_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid_images" ADD CONSTRAINT "pages_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid" ADD CONSTRAINT "pages_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_work" ADD CONSTRAINT "pages_blocks_featured_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_grid" ADD CONSTRAINT "pages_blocks_case_study_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall" ADD CONSTRAINT "pages_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lifecycle_section_artifacts" ADD CONSTRAINT "pages_blocks_lifecycle_section_artifacts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_lifecycle_section_artifacts" ADD CONSTRAINT "pages_blocks_lifecycle_section_artifacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lifecycle_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lifecycle_section" ADD CONSTRAINT "pages_blocks_lifecycle_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capabilities_items" ADD CONSTRAINT "pages_blocks_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capabilities" ADD CONSTRAINT "pages_blocks_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_values_values" ADD CONSTRAINT "pages_blocks_values_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_values" ADD CONSTRAINT "pages_blocks_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_motion_image" ADD CONSTRAINT "pages_blocks_motion_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_motion_image" ADD CONSTRAINT "pages_blocks_motion_image_mask_image_id_media_id_fk" FOREIGN KEY ("mask_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_motion_image" ADD CONSTRAINT "pages_blocks_motion_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lottie" ADD CONSTRAINT "pages_blocks_lottie_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_lottie" ADD CONSTRAINT "pages_blocks_lottie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee_logos" ADD CONSTRAINT "pages_blocks_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_baserate_case_study_scope" ADD CONSTRAINT "pages_blocks_baserate_case_study_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_baserate_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_baserate_case_study" ADD CONSTRAINT "pages_blocks_baserate_case_study_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_brand" ADD CONSTRAINT "case_studies_brand_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_metrics" ADD CONSTRAINT "case_studies_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_hero" ADD CONSTRAINT "case_studies_blocks_hero_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_hero" ADD CONSTRAINT "case_studies_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_text_section" ADD CONSTRAINT "case_studies_blocks_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_image" ADD CONSTRAINT "case_studies_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_image" ADD CONSTRAINT "case_studies_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_image_grid_images" ADD CONSTRAINT "case_studies_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_image_grid_images" ADD CONSTRAINT "case_studies_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_image_grid" ADD CONSTRAINT "case_studies_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_spacer" ADD CONSTRAINT "case_studies_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_featured_work" ADD CONSTRAINT "case_studies_blocks_featured_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_case_study_grid" ADD CONSTRAINT "case_studies_blocks_case_study_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_logo_wall" ADD CONSTRAINT "case_studies_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_lifecycle_section_artifacts" ADD CONSTRAINT "case_studies_blocks_lifecycle_section_artifacts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_lifecycle_section_artifacts" ADD CONSTRAINT "case_studies_blocks_lifecycle_section_artifacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_lifecycle_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_lifecycle_section" ADD CONSTRAINT "case_studies_blocks_lifecycle_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_capabilities_items" ADD CONSTRAINT "case_studies_blocks_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_capabilities" ADD CONSTRAINT "case_studies_blocks_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_values_values" ADD CONSTRAINT "case_studies_blocks_values_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_values" ADD CONSTRAINT "case_studies_blocks_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_cta" ADD CONSTRAINT "case_studies_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_motion_image" ADD CONSTRAINT "case_studies_blocks_motion_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_motion_image" ADD CONSTRAINT "case_studies_blocks_motion_image_mask_image_id_media_id_fk" FOREIGN KEY ("mask_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_motion_image" ADD CONSTRAINT "case_studies_blocks_motion_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_lottie" ADD CONSTRAINT "case_studies_blocks_lottie_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_lottie" ADD CONSTRAINT "case_studies_blocks_lottie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_marquee_logos" ADD CONSTRAINT "case_studies_blocks_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_baserate_case_study_scope" ADD CONSTRAINT "case_studies_blocks_baserate_case_study_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_baserate_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_baserate_case_study" ADD CONSTRAINT "case_studies_blocks_baserate_case_study_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "logos" ADD CONSTRAINT "logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "logos" ADD CONSTRAINT "logos_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_headshot_id_media_id_fk" FOREIGN KEY ("headshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_case_studies_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_social_links" ADD CONSTRAINT "settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_default_o_g_image_id_media_id_fk" FOREIGN KEY ("default_o_g_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_items" ADD CONSTRAINT "footer_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_settings_fk" FOREIGN KEY ("settings_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_navigation_fk" FOREIGN KEY ("navigation_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_brand_order_idx" ON "pages_brand" USING btree ("order");
  CREATE INDEX "pages_brand_parent_idx" ON "pages_brand" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_background_media_idx" ON "pages_blocks_hero" USING btree ("background_media_id");
  CREATE INDEX "pages_blocks_text_section_order_idx" ON "pages_blocks_text_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_section_parent_id_idx" ON "pages_blocks_text_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_section_path_idx" ON "pages_blocks_text_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_grid_images_order_idx" ON "pages_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_grid_images_parent_id_idx" ON "pages_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_grid_images_image_idx" ON "pages_blocks_image_grid_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_grid_order_idx" ON "pages_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_grid_parent_id_idx" ON "pages_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_grid_path_idx" ON "pages_blocks_image_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_work_order_idx" ON "pages_blocks_featured_work" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_work_parent_id_idx" ON "pages_blocks_featured_work" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_work_path_idx" ON "pages_blocks_featured_work" USING btree ("_path");
  CREATE INDEX "pages_blocks_case_study_grid_order_idx" ON "pages_blocks_case_study_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_grid_parent_id_idx" ON "pages_blocks_case_study_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_grid_path_idx" ON "pages_blocks_case_study_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_wall_order_idx" ON "pages_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_parent_id_idx" ON "pages_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_path_idx" ON "pages_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "pages_blocks_lifecycle_section_artifacts_order_idx" ON "pages_blocks_lifecycle_section_artifacts" USING btree ("_order");
  CREATE INDEX "pages_blocks_lifecycle_section_artifacts_parent_id_idx" ON "pages_blocks_lifecycle_section_artifacts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lifecycle_section_artifacts_image_idx" ON "pages_blocks_lifecycle_section_artifacts" USING btree ("image_id");
  CREATE INDEX "pages_blocks_lifecycle_section_order_idx" ON "pages_blocks_lifecycle_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_lifecycle_section_parent_id_idx" ON "pages_blocks_lifecycle_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lifecycle_section_path_idx" ON "pages_blocks_lifecycle_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_capabilities_items_order_idx" ON "pages_blocks_capabilities_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_capabilities_items_parent_id_idx" ON "pages_blocks_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capabilities_order_idx" ON "pages_blocks_capabilities" USING btree ("_order");
  CREATE INDEX "pages_blocks_capabilities_parent_id_idx" ON "pages_blocks_capabilities" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capabilities_path_idx" ON "pages_blocks_capabilities" USING btree ("_path");
  CREATE INDEX "pages_blocks_values_values_order_idx" ON "pages_blocks_values_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_values_parent_id_idx" ON "pages_blocks_values_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_order_idx" ON "pages_blocks_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_parent_id_idx" ON "pages_blocks_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_path_idx" ON "pages_blocks_values" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_motion_image_order_idx" ON "pages_blocks_motion_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_motion_image_parent_id_idx" ON "pages_blocks_motion_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_motion_image_path_idx" ON "pages_blocks_motion_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_motion_image_image_idx" ON "pages_blocks_motion_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_motion_image_mask_image_idx" ON "pages_blocks_motion_image" USING btree ("mask_image_id");
  CREATE INDEX "pages_blocks_lottie_order_idx" ON "pages_blocks_lottie" USING btree ("_order");
  CREATE INDEX "pages_blocks_lottie_parent_id_idx" ON "pages_blocks_lottie" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lottie_path_idx" ON "pages_blocks_lottie" USING btree ("_path");
  CREATE INDEX "pages_blocks_lottie_file_idx" ON "pages_blocks_lottie" USING btree ("file_id");
  CREATE INDEX "pages_blocks_marquee_logos_order_idx" ON "pages_blocks_marquee_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_logos_parent_id_idx" ON "pages_blocks_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_logos_path_idx" ON "pages_blocks_marquee_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_baserate_case_study_scope_order_idx" ON "pages_blocks_baserate_case_study_scope" USING btree ("_order");
  CREATE INDEX "pages_blocks_baserate_case_study_scope_parent_id_idx" ON "pages_blocks_baserate_case_study_scope" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_baserate_case_study_order_idx" ON "pages_blocks_baserate_case_study" USING btree ("_order");
  CREATE INDEX "pages_blocks_baserate_case_study_parent_id_idx" ON "pages_blocks_baserate_case_study" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_baserate_case_study_path_idx" ON "pages_blocks_baserate_case_study" USING btree ("_path");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_case_studies_id_idx" ON "pages_rels" USING btree ("case_studies_id");
  CREATE INDEX "pages_rels_logos_id_idx" ON "pages_rels" USING btree ("logos_id");
  CREATE INDEX "case_studies_brand_order_idx" ON "case_studies_brand" USING btree ("order");
  CREATE INDEX "case_studies_brand_parent_idx" ON "case_studies_brand" USING btree ("parent_id");
  CREATE INDEX "case_studies_metrics_order_idx" ON "case_studies_metrics" USING btree ("_order");
  CREATE INDEX "case_studies_metrics_parent_id_idx" ON "case_studies_metrics" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_hero_order_idx" ON "case_studies_blocks_hero" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_hero_parent_id_idx" ON "case_studies_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_hero_path_idx" ON "case_studies_blocks_hero" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_hero_background_media_idx" ON "case_studies_blocks_hero" USING btree ("background_media_id");
  CREATE INDEX "case_studies_blocks_text_section_order_idx" ON "case_studies_blocks_text_section" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_text_section_parent_id_idx" ON "case_studies_blocks_text_section" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_text_section_path_idx" ON "case_studies_blocks_text_section" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_image_order_idx" ON "case_studies_blocks_image" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_image_parent_id_idx" ON "case_studies_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_image_path_idx" ON "case_studies_blocks_image" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_image_image_idx" ON "case_studies_blocks_image" USING btree ("image_id");
  CREATE INDEX "case_studies_blocks_image_grid_images_order_idx" ON "case_studies_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_image_grid_images_parent_id_idx" ON "case_studies_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_image_grid_images_image_idx" ON "case_studies_blocks_image_grid_images" USING btree ("image_id");
  CREATE INDEX "case_studies_blocks_image_grid_order_idx" ON "case_studies_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_image_grid_parent_id_idx" ON "case_studies_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_image_grid_path_idx" ON "case_studies_blocks_image_grid" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_spacer_order_idx" ON "case_studies_blocks_spacer" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_spacer_parent_id_idx" ON "case_studies_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_spacer_path_idx" ON "case_studies_blocks_spacer" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_featured_work_order_idx" ON "case_studies_blocks_featured_work" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_featured_work_parent_id_idx" ON "case_studies_blocks_featured_work" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_featured_work_path_idx" ON "case_studies_blocks_featured_work" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_case_study_grid_order_idx" ON "case_studies_blocks_case_study_grid" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_case_study_grid_parent_id_idx" ON "case_studies_blocks_case_study_grid" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_case_study_grid_path_idx" ON "case_studies_blocks_case_study_grid" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_logo_wall_order_idx" ON "case_studies_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_logo_wall_parent_id_idx" ON "case_studies_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_logo_wall_path_idx" ON "case_studies_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_lifecycle_section_artifacts_order_idx" ON "case_studies_blocks_lifecycle_section_artifacts" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_lifecycle_section_artifacts_parent_id_idx" ON "case_studies_blocks_lifecycle_section_artifacts" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_lifecycle_section_artifacts_image_idx" ON "case_studies_blocks_lifecycle_section_artifacts" USING btree ("image_id");
  CREATE INDEX "case_studies_blocks_lifecycle_section_order_idx" ON "case_studies_blocks_lifecycle_section" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_lifecycle_section_parent_id_idx" ON "case_studies_blocks_lifecycle_section" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_lifecycle_section_path_idx" ON "case_studies_blocks_lifecycle_section" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_capabilities_items_order_idx" ON "case_studies_blocks_capabilities_items" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_capabilities_items_parent_id_idx" ON "case_studies_blocks_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_capabilities_order_idx" ON "case_studies_blocks_capabilities" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_capabilities_parent_id_idx" ON "case_studies_blocks_capabilities" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_capabilities_path_idx" ON "case_studies_blocks_capabilities" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_values_values_order_idx" ON "case_studies_blocks_values_values" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_values_values_parent_id_idx" ON "case_studies_blocks_values_values" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_values_order_idx" ON "case_studies_blocks_values" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_values_parent_id_idx" ON "case_studies_blocks_values" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_values_path_idx" ON "case_studies_blocks_values" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_cta_order_idx" ON "case_studies_blocks_cta" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_cta_parent_id_idx" ON "case_studies_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_cta_path_idx" ON "case_studies_blocks_cta" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_motion_image_order_idx" ON "case_studies_blocks_motion_image" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_motion_image_parent_id_idx" ON "case_studies_blocks_motion_image" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_motion_image_path_idx" ON "case_studies_blocks_motion_image" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_motion_image_image_idx" ON "case_studies_blocks_motion_image" USING btree ("image_id");
  CREATE INDEX "case_studies_blocks_motion_image_mask_image_idx" ON "case_studies_blocks_motion_image" USING btree ("mask_image_id");
  CREATE INDEX "case_studies_blocks_lottie_order_idx" ON "case_studies_blocks_lottie" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_lottie_parent_id_idx" ON "case_studies_blocks_lottie" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_lottie_path_idx" ON "case_studies_blocks_lottie" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_lottie_file_idx" ON "case_studies_blocks_lottie" USING btree ("file_id");
  CREATE INDEX "case_studies_blocks_marquee_logos_order_idx" ON "case_studies_blocks_marquee_logos" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_marquee_logos_parent_id_idx" ON "case_studies_blocks_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_marquee_logos_path_idx" ON "case_studies_blocks_marquee_logos" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_baserate_case_study_scope_order_idx" ON "case_studies_blocks_baserate_case_study_scope" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_baserate_case_study_scope_parent_id_idx" ON "case_studies_blocks_baserate_case_study_scope" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_baserate_case_study_order_idx" ON "case_studies_blocks_baserate_case_study" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_baserate_case_study_parent_id_idx" ON "case_studies_blocks_baserate_case_study" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_baserate_case_study_path_idx" ON "case_studies_blocks_baserate_case_study" USING btree ("_path");
  CREATE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_hero_image_idx" ON "case_studies" USING btree ("hero_image_id");
  CREATE INDEX "case_studies_hero_video_idx" ON "case_studies" USING btree ("hero_video_id");
  CREATE INDEX "case_studies_testimonial_idx" ON "case_studies" USING btree ("testimonial_id");
  CREATE INDEX "case_studies_seo_seo_og_image_idx" ON "case_studies" USING btree ("seo_og_image_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_tags_id_idx" ON "case_studies_rels" USING btree ("tags_id");
  CREATE INDEX "case_studies_rels_case_studies_id_idx" ON "case_studies_rels" USING btree ("case_studies_id");
  CREATE INDEX "case_studies_rels_logos_id_idx" ON "case_studies_rels" USING btree ("logos_id");
  CREATE INDEX "logos_image_idx" ON "logos" USING btree ("image_id");
  CREATE INDEX "logos_image_dark_idx" ON "logos" USING btree ("image_dark_id");
  CREATE INDEX "logos_updated_at_idx" ON "logos" USING btree ("updated_at");
  CREATE INDEX "logos_created_at_idx" ON "logos" USING btree ("created_at");
  CREATE INDEX "testimonials_headshot_idx" ON "testimonials" USING btree ("headshot_id");
  CREATE INDEX "testimonials_project_idx" ON "testimonials" USING btree ("project_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "settings_social_links_order_idx" ON "settings_social_links" USING btree ("_order");
  CREATE INDEX "settings_social_links_parent_id_idx" ON "settings_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "settings_brand_idx" ON "settings" USING btree ("brand");
  CREATE INDEX "settings_default_o_g_image_idx" ON "settings" USING btree ("default_o_g_image_id");
  CREATE INDEX "settings_updated_at_idx" ON "settings" USING btree ("updated_at");
  CREATE INDEX "settings_created_at_idx" ON "settings" USING btree ("created_at");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_page_idx" ON "navigation_items" USING btree ("page_id");
  CREATE UNIQUE INDEX "navigation_brand_idx" ON "navigation" USING btree ("brand");
  CREATE INDEX "navigation_updated_at_idx" ON "navigation" USING btree ("updated_at");
  CREATE INDEX "navigation_created_at_idx" ON "navigation" USING btree ("created_at");
  CREATE INDEX "footer_columns_items_order_idx" ON "footer_columns_items" USING btree ("_order");
  CREATE INDEX "footer_columns_items_parent_id_idx" ON "footer_columns_items" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_brand_idx" ON "footer" USING btree ("brand");
  CREATE INDEX "footer_updated_at_idx" ON "footer" USING btree ("updated_at");
  CREATE INDEX "footer_created_at_idx" ON "footer" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("logos_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("settings_id");
  CREATE INDEX "payload_locked_documents_rels_navigation_id_idx" ON "payload_locked_documents_rels" USING btree ("navigation_id");
  CREATE INDEX "payload_locked_documents_rels_footer_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_brand" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_text_section" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_image_grid_images" CASCADE;
  DROP TABLE "pages_blocks_image_grid" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_blocks_featured_work" CASCADE;
  DROP TABLE "pages_blocks_case_study_grid" CASCADE;
  DROP TABLE "pages_blocks_logo_wall" CASCADE;
  DROP TABLE "pages_blocks_lifecycle_section_artifacts" CASCADE;
  DROP TABLE "pages_blocks_lifecycle_section" CASCADE;
  DROP TABLE "pages_blocks_capabilities_items" CASCADE;
  DROP TABLE "pages_blocks_capabilities" CASCADE;
  DROP TABLE "pages_blocks_values_values" CASCADE;
  DROP TABLE "pages_blocks_values" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_motion_image" CASCADE;
  DROP TABLE "pages_blocks_lottie" CASCADE;
  DROP TABLE "pages_blocks_marquee_logos" CASCADE;
  DROP TABLE "pages_blocks_baserate_case_study_scope" CASCADE;
  DROP TABLE "pages_blocks_baserate_case_study" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "case_studies_brand" CASCADE;
  DROP TABLE "case_studies_metrics" CASCADE;
  DROP TABLE "case_studies_blocks_hero" CASCADE;
  DROP TABLE "case_studies_blocks_text_section" CASCADE;
  DROP TABLE "case_studies_blocks_image" CASCADE;
  DROP TABLE "case_studies_blocks_image_grid_images" CASCADE;
  DROP TABLE "case_studies_blocks_image_grid" CASCADE;
  DROP TABLE "case_studies_blocks_spacer" CASCADE;
  DROP TABLE "case_studies_blocks_featured_work" CASCADE;
  DROP TABLE "case_studies_blocks_case_study_grid" CASCADE;
  DROP TABLE "case_studies_blocks_logo_wall" CASCADE;
  DROP TABLE "case_studies_blocks_lifecycle_section_artifacts" CASCADE;
  DROP TABLE "case_studies_blocks_lifecycle_section" CASCADE;
  DROP TABLE "case_studies_blocks_capabilities_items" CASCADE;
  DROP TABLE "case_studies_blocks_capabilities" CASCADE;
  DROP TABLE "case_studies_blocks_values_values" CASCADE;
  DROP TABLE "case_studies_blocks_values" CASCADE;
  DROP TABLE "case_studies_blocks_cta" CASCADE;
  DROP TABLE "case_studies_blocks_motion_image" CASCADE;
  DROP TABLE "case_studies_blocks_lottie" CASCADE;
  DROP TABLE "case_studies_blocks_marquee_logos" CASCADE;
  DROP TABLE "case_studies_blocks_baserate_case_study_scope" CASCADE;
  DROP TABLE "case_studies_blocks_baserate_case_study" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "logos" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "settings_social_links" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "footer_columns_items" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_pages_brand";
  DROP TYPE "public"."enum_pages_blocks_hero_background";
  DROP TYPE "public"."enum_pages_blocks_text_section_width";
  DROP TYPE "public"."enum_pages_blocks_image_width";
  DROP TYPE "public"."enum_pages_blocks_image_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_image_grid_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_blocks_featured_work_layout";
  DROP TYPE "public"."enum_pages_blocks_case_study_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_lifecycle_section_phase";
  DROP TYPE "public"."enum_pages_blocks_capabilities_style";
  DROP TYPE "public"."enum_pages_blocks_cta_align";
  DROP TYPE "public"."enum_pages_blocks_motion_image_rounded";
  DROP TYPE "public"."enum_pages_blocks_motion_image_shadow";
  DROP TYPE "public"."enum_pages_blocks_motion_image_hover";
  DROP TYPE "public"."enum_pages_blocks_motion_image_width";
  DROP TYPE "public"."enum_pages_blocks_lottie_width";
  DROP TYPE "public"."enum_pages_blocks_marquee_logos_direction";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_case_studies_brand";
  DROP TYPE "public"."enum_case_studies_blocks_hero_background";
  DROP TYPE "public"."enum_case_studies_blocks_text_section_width";
  DROP TYPE "public"."enum_case_studies_blocks_image_width";
  DROP TYPE "public"."enum_case_studies_blocks_image_grid_columns";
  DROP TYPE "public"."enum_case_studies_blocks_image_grid_aspect_ratio";
  DROP TYPE "public"."enum_case_studies_blocks_spacer_size";
  DROP TYPE "public"."enum_case_studies_blocks_featured_work_layout";
  DROP TYPE "public"."enum_case_studies_blocks_case_study_grid_columns";
  DROP TYPE "public"."enum_case_studies_blocks_lifecycle_section_phase";
  DROP TYPE "public"."enum_case_studies_blocks_capabilities_style";
  DROP TYPE "public"."enum_case_studies_blocks_cta_align";
  DROP TYPE "public"."enum_case_studies_blocks_motion_image_rounded";
  DROP TYPE "public"."enum_case_studies_blocks_motion_image_shadow";
  DROP TYPE "public"."enum_case_studies_blocks_motion_image_hover";
  DROP TYPE "public"."enum_case_studies_blocks_motion_image_width";
  DROP TYPE "public"."enum_case_studies_blocks_lottie_width";
  DROP TYPE "public"."enum_case_studies_blocks_marquee_logos_direction";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum_logos_industry";
  DROP TYPE "public"."enum_settings_social_links_platform";
  DROP TYPE "public"."enum_settings_brand";
  DROP TYPE "public"."enum_navigation_items_type";
  DROP TYPE "public"."enum_navigation_brand";
  DROP TYPE "public"."enum_footer_brand";`)
}
