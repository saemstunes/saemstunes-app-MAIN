import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./TiltedCard.css";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client"; // Add supabase import

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "100%",
  imageWidth = "100%",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [resolvedImageSrc, setResolvedImageSrc] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Resolve image source
    const resolveImage = async () => {
      try {
        if (imageSrc.startsWith('http')) {
          setResolvedImageSrc(imageSrc);
        } else {
          // Handle Supabase paths
          const { data } = supabase.storage
            .from('tracks')
            .getPublicUrl(imageSrc);
          setResolvedImageSrc(data.publicUrl);
        }
      } catch (error) {
        console.error("Error resolving image:", error);
        setResolvedImageSrc('/default-cover.jpg');
      }
    };

    resolveImage();
  }, [imageSrc]);
  

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    setIsHovered(true);
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="tilted-card-inner"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* Image container with proper dimensions */}
        <div 
          className="tilted-card-image-container" 
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            borderRadius: "15px",
          }}
        >
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div 
              className="tilted-card-loading" 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "hsl(var(--muted))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(var(--muted-foreground))",
                fontSize: "0.875rem",
              }}
            >
              Loading image...
            </div>
          )}

          {/* Actual image */}
          {resolvedImageSrc && (
            <motion.img
              src={resolvedImageSrc}
              alt={altText}
              className="tilted-card-img"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.5s ease",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error("Failed to load image:", resolvedImageSrc);
                e.currentTarget.src = '/default-cover.jpg';
                setImageLoaded(true);
              }}
            />
          )}
        </div>

        {/* Overlay content */}
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="tilted-card-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              borderRadius: "15px",
              pointerEvents: "none",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {/* Caption tooltip */}
      {showTooltip && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
