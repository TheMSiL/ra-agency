"use client"

import { gsap } from 'gsap'
import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import { useI18n } from '@/context/I18nContext'
import type { TrustedCompany } from '@/sanity/lib/trust'

export default function Trust({ companies }: { companies: TrustedCompany[] }) {
	const { t } = useI18n()
	const marqueeRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLDivElement>(null)
	const marqueeCompanies = [...companies, ...companies]

	useLayoutEffect(() => {
		const marquee = marqueeRef.current
		const track = trackRef.current
		if (!marquee || !track) return

		const context = gsap.context(() => {
			const tween = gsap.to(track, {
				xPercent: -50,
				duration: 28,
				ease: 'none',
				repeat: -1,
			})
			let startX = 0
			let previousX = 0
			let previousTime = 0
			let startProgress = 0
			let velocity = 0
			let isDragging = false

			const wrapProgress = gsap.utils.wrap(0, 1)
			const onPointerDown = (event: PointerEvent) => {
				isDragging = true
				startX = previousX = event.clientX
				previousTime = performance.now()
				startProgress = tween.progress()
				velocity = 0
				marquee.classList.add('is-dragging')
				marquee.setPointerCapture(event.pointerId)
				tween.pause()
			}

			const onPointerMove = (event: PointerEvent) => {
				if (!isDragging) return
				const now = performance.now()
				const elapsed = Math.max(now - previousTime, 1)
				velocity = (event.clientX - previousX) / elapsed
				previousX = event.clientX
				previousTime = now
				const loopWidth = track.scrollWidth / 2
				tween.progress(wrapProgress(startProgress - (event.clientX - startX) / loopWidth))
			}

			const finishDrag = (event: PointerEvent) => {
				if (!isDragging) return
				isDragging = false
				marquee.classList.remove('is-dragging')
				if (marquee.hasPointerCapture(event.pointerId)) marquee.releasePointerCapture(event.pointerId)
				const loopWidth = track.scrollWidth / 2
				tween.progress(wrapProgress(tween.progress() - (velocity * 180) / loopWidth))
				tween.resume()
				gsap.fromTo(tween, { timeScale: 0.35 }, { timeScale: 1, duration: 0.8, ease: 'power2.out' })
			}

			marquee.addEventListener('pointerdown', onPointerDown)
			marquee.addEventListener('pointermove', onPointerMove)
			marquee.addEventListener('pointerup', finishDrag)
			marquee.addEventListener('pointercancel', finishDrag)

			return () => {
				marquee.removeEventListener('pointerdown', onPointerDown)
				marquee.removeEventListener('pointermove', onPointerMove)
				marquee.removeEventListener('pointerup', finishDrag)
				marquee.removeEventListener('pointercancel', finishDrag)
				tween.kill()
			}
		}, marquee)

		return () => context.revert()
	}, [])

	return (
		<section className='trust pt-20 sm:pt-32'>
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title uppercase">{t("trust.title")}</h2>
			</div>
			{companies.length > 0 && <div className="trust_marquee" ref={marqueeRef} aria-label="Trusted company logos">
				<div className="trust_track" ref={trackRef}>
					{marqueeCompanies.map((company, index) => (
						<div className="trust_logo" key={`${company.id}-${index}`} aria-hidden={index >= companies.length}>
							<div className="trust_logo-image"><Image src={company.logoUrl} alt={company.name} width={128} height={128} unoptimized /></div>
							<p>{company.caption}</p>
						</div>
					))}
				</div>
			</div>}
		</section>
	);
}
