/**
 * Created by timothyferrell on 3/18/17.
 */

function ParticleSystem(spec, graphics) {
    let that = {};
    let nextName = 1;
    let particles = {};
    let imgSrc = spec.image;

    spec.image = new Image();
    spec.image.onload = function () {
        //replace the render fn to help eliminate need to have a bool checked on each call
        that.render = function () {
            let value;
            let particle;

            for( value  in particles){
                if(particles.hasOwnProperty(value)){
                    particle = particles[value];
                    graphics.particleDraw(particle);
                }
            }
        }
    };
    spec.image.src = imgSrc;

    that.create = function () {
        let p = {
            image: spec.image,
            size: Random.nextGaussian(10, 4),
            center: {x: spec.center.x, y: spec.center.y},
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
            rotation: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
            alive: 0
        };
        p.size = Math.max(1, p.size);
        p.lifetime = Math.max(1, p.lifetime);
        particles[nextName++] = p;
    };

    that.update = function (time) {
        let removeMe = [];
        let value;
        let particle;

        time = time / 1000;

        for(value in particles){
            if(particles.hasOwnProperty(value)){
                particle = particles[value];
                particle.alive += time;
                particle.center.x += (time * particle.speed * particle.direction.x);
                particle.center.y += (time * particle.speed * particle.direction.y);
                particle.rotation += particle.speed /200;
                if(particle.alive > particle.lifetime){
                    removeMe.push(value);
                }
            }
        }

        for (particle = 0; particle < removeMe.length; particle++){
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    };

    that.render = function () { };

    return that;
}