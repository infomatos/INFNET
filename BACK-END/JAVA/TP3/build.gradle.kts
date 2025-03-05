plugins {
    id("java")
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    implementation ("org.json:json:20171018")
    implementation ("com.fasterxml.jackson.core:jackson-databind:2.14.1")


    testImplementation ("org.junit.jupiter:junit-jupiter-api:5.7.1")
    testRuntimeOnly ("org.junit.jupiter:junit-jupiter-engine:5.7.1")
}

tasks.test {
    useJUnitPlatform()
}